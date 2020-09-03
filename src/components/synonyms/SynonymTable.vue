<template>
  <div>
    <ag-grid-vue
      style="height: 250px;"
      class="ag-theme-alpine"
      :columnDefs="columnDefs"
      :defaultColDef="defaultColDef"
      :rowData="rowData"
      :gridOptions="gridOptions"
    />
    <div class="d-flex flex-row justify-content-end my-3">
      <b-button @click="resetRowData">Reset</b-button>
      <b-button variant="primary" @click="save">Save Synonyms</b-button>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import _ from "lodash";
import { AgGridVue } from "ag-grid-vue";
import {
  MappableCellRenderer,
  SelectObjectCellEditor
} from "@/ag-grid-components/custom-renderers";

export default {
  name: "SynonymTable",
  components: {
    AgGridVue
  },
  props: {
    substanceId: String
  },
  data() {
    return {
      originalData: null,
      rowData: null,
      defaultColDef: null,
      gridOptions: null
    };
  },
  computed: {
    ...mapState("synonym", ["list"]),
    ...mapState("source", { sourceList: "list" }),
    ...mapState("synonymQuality", { qualityList: "list" }),
    ...mapState("synonymType", { typeList: "list" }),
    columnDefs: function() {
      return [
        { headerName: "Identifier", field: "attributes.identifier" },
        {
          headerName: "Source",
          field: "relationships.source.data.id",
          cellRenderer: "mappableCellRenderer",
          cellRendererParams: {
            map: this.sourceListMap
          },
          cellEditor: "selectObjectCellEditor",
          cellEditorParams: {
            cellRenderer: "mappableCellRenderer",
            values: this.sourceListOptions
          }
        },
        {
          headerName: "Quality",
          field: "relationships.synonymQuality.data.id",
          cellRenderer: "mappableCellRenderer",
          cellRendererParams: {
            map: this.qualityListMap
          },
          cellEditor: "selectObjectCellEditor",
          cellEditorParams: {
            cellRenderer: "mappableCellRenderer",
            values: this.qualityListOptions
          }
        },
        {
          headerName: "Type",
          field: "relationships.synonymType.data.id",
          cellRenderer: "mappableCellRenderer",
          cellRendererParams: {
            map: this.typeListMap
          },
          cellEditor: "selectObjectCellEditor",
          cellEditorParams: {
            cellRenderer: "mappableCellRenderer",
            values: this.typeListOptions
          }
        },
        {
          headerName: "QC Notes",
          field: "attributes.qcNotes",
          cellEditor: "agLargeTextCellEditor"
        }
      ];
    },
    sourceListOptions: function() {
      return this.sourceList.map(i => {
        return { value: i.id, text: i.attributes.label };
      });
    },
    sourceListMap: function() {
      let map = {};
      for (let source of this.sourceList) map[source.id] = { ...source };
      return map;
    },
    qualityListOptions: function() {
      return this.qualityList.map(i => {
        return { value: i.id, text: i.attributes.label };
      });
    },
    qualityListMap: function() {
      let map = {};
      for (let quality of this.qualityList) map[quality.id] = { ...quality };
      return map;
    },
    typeListOptions: function() {
      return this.typeList.map(i => {
        return { value: i.id, text: i.attributes.label };
      });
    },
    typeListMap: function() {
      let map = {};
      for (let type of this.typeList) map[type.id] = { ...type };
      return map;
    }
  },
  watch: {
    list: function() {
      this.resetRowData();
    },
    substanceId: function() {
      if (this.substanceId)
        this.getList({
          params: [{ key: "filter[substance.id]", value: this.substanceId }]
        });
    }
  },
  methods: {
    ...mapActions("synonym", ["getList", "patch"]),
    ...mapActions("synonymQuality", { loadQualityList: "getList" }),
    ...mapActions("synonymType", { loadTypeList: "getList" }),
    ...mapActions("source", { loadSourceList: "getList" }),
    resetRowData: function() {
      this.rowData = _.cloneDeep(this.list);
      this.gridOptions.api.refreshCells({
        force: true,
        suppressFlash: false
      });
    },
    save: function() {
      let i;
      for (i in this.rowData) {
        if (!_.isEqual(this.rowData[i], this.list[i])) {
          this.patch({ id: this.rowData[i].id, body: this.rowData[i] });
        }
      }
    }
  },
  beforeMount() {
    this.gridOptions = {
      components: {
        mappableCellRenderer: MappableCellRenderer,
        selectObjectCellEditor: SelectObjectCellEditor
      }
    };

    this.defaultColDef = {
      flex: 1,
      editable: true,
      resizable: true
    };
  },
  mounted() {
    this.loadQualityList();
    this.loadSourceList();
    this.loadTypeList();
  }
};
</script>

<style scoped></style>
