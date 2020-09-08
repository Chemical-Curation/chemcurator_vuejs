<template>
  <div>
    <ag-grid-vue
      style="height: 250px;"
      class="ag-theme-alpine"
      :columnDefs="columnDefs"
      :defaultColDef="defaultColDef"
      :rowData="rowData"
      :gridOptions="gridOptions"
      :rowClassRules="rowClassRules"
    />
    <div class="d-flex flex-row justify-content-end my-3">
      <b-button
        @click="resetRowData"
        :disabled="!buttonsEnabled && isAuthenticated"
        >Reset</b-button
      >
      <b-button
        class="ml-1"
        variant="primary"
        @click="save"
        :disabled="!buttonsEnabled"
      >
        Save Synonyms
      </b-button>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";
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
      gridOptions: null,
      buttonsEnabled: false,
      errorRows: []
    };
  },
  computed: {
    ...mapGetters("auth", ["isAuthenticated"]),
    ...mapState("synonym", ["list", "loading"]),
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
    rowClassRules: function() {
      return {
        "error-row": params => {
          // console.log(params.data.id)
          // console.log(this.errorRows)
          // console.log(this.errorRows.includes(params.data.id))
          // console.log(this.errorRows.includes(params.data.id.toString()))
          return this.errorRows.includes(params.data.id.toString());
        }
      };
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
      if (this.substanceId) this.loadSynonyms();
    },
    loading: function() {
      this.manageOverlay();
    }
  },
  methods: {
    ...mapActions("alert", ["alert"]),
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
    save: async function() {
      let responses = [];
      for (let i in this.rowData) {
        if (!_.isEqual(this.rowData[i], this.list[i])) {
          responses.push(
            this.patch({ id: this.rowData[i].id, body: this.rowData[i] }).catch(
              err => {
                return {
                  failed: true,
                  body: this.rowData[i],
                  errors: err.response.data.errors
                };
              }
            )
          );
        }
      }
      await Promise.allSettled(responses).then(responses => {
        let rejected = responses.filter(obj => {
          return obj.value.failed;
        });
        this.errorRows = [];
        if (rejected.length === 0) {
          this.alert({
            message: "All synonyms saved successfully",
            color: "success",
            dismissCountDown: 15
          });
        } else {
          let header = "The following Synonyms could not be updated.";
          let message = "";
          for (let reject of rejected) {
            this.errorRows.push(reject.value.body.id);
            message += `The synonym with identifier '${reject.value.body.attributes.identifier}' was rejected for the following reasons: <br>`;
            for (let error of reject.value.errors) {
              message += `${error.detail} <br>`;
            }
          }
          this.alert({
            header: header,
            message: message,
            color: "warning",
            dismissCountDown: 15
          });
        }
      });
      window.scrollTo(0, 0);
      this.loadSynonyms();
    },
    loadSynonyms: function() {
      this.getList({
        params: [{ key: "filter[substance.id]", value: this.substanceId }]
      });
    },
    manageOverlay: function() {
      if (this.loading) {
        this.gridOptions.api.showLoadingOverlay();
        this.buttonsEnabled = false;
      } else if (!this.loading && _.isEqual(this.list, [])) {
        this.gridOptions.api.showNoRowsOverlay();
        this.buttonsEnabled = false;
      } else {
        this.gridOptions.api.hideOverlay();
        this.buttonsEnabled = true;
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
    this.manageOverlay();
    this.loadQualityList();
    this.loadSourceList();
    this.loadTypeList();
  }
};
</script>

<style>
.error-row {
  background-color: sandybrown !important;
}
</style>
