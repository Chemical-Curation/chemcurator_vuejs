<template>
  <div>
    <ag-grid-vue style="height: 250px;"
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
import {mapActions, mapState} from "vuex";
import _ from "lodash"
import {AgGridVue} from "ag-grid-vue";

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
      columnDefs: null,
      rowData: null,
      defaultColDef: null,
      gridOptions: null,
    };
  },
  computed: {
    ...mapState("synonym", ["list"])
  },
  watch: {
    list: function () {
      this.resetRowData()
    },
    substanceId: function (){
      if (this.substanceId)
        this.getList({
          params: [{ key: "filter[substance.id]", value: this.substanceId }]
        });
    }
  },
  methods: {
    ...mapActions("synonym", ["getList"]),
    resetRowData: function () {
      this.rowData = _.cloneDeep(this.list)
      this.gridOptions.api.refreshCells({
        force: true,
        suppressFlash: false,
      });
    },
    save: function (){
      let i
      for (i in this.rowData) {
        if (!_.isEqual(this.rowData[i], this.list[i])){
          // log changed rows todo: save
          console.log(this.rowData[i])
        }
      }
    }
  },
  beforeMount() {
    this.gridOptions = {}

    this.columnDefs = [
        {headerName: 'id', field: 'id', show: false},
        {headerName: 'identifier', field: 'attributes.identifier', editable: true},
    ];

    this.defaultColDef = {
      flex: 1,
      editable: true,
      resizable: true,
    };
  },
};
</script>

<style scoped></style>
