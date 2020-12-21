<template>
  <div>
    <h3 class="text-left">Lists</h3>
    <ag-grid-vue
      id="listTable"
      style="height: 250px;"
      class="ag-theme-alpine"
      :columnDefs="columnDefs"
      :defaultColDef="defaultColDef"
      :rowData="rowData"
      :gridOptions="gridOptions"
    />
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";
import _ from "lodash";
import { AgGridVue } from "ag-grid-vue";
import {
  MappableCellRenderer,
  SelectObjectCellEditor
} from "@/components/ag-grid/custom-renderers";

export default {
  name: "agListTable",
  components: {
    AgGridVue
  },
  props: {
    // Substance ID to which these synonyms will be related
    substanceId: String
  },
  data() {
    return {
      rowData: null,
      defaultColDef: null,
      gridOptions: null
    };
  },
  computed: {
    ...mapGetters("auth", ["isAuthenticated"]),
    ...mapState("record", ["list", "loading", "included"]),

    /**
     * Defines the columns to be used in ag grid table
     */
    columnDefs: function() {
      return [
        {
          headerName: "List Label",
          valueGetter: this.listLabelGetter
        },
        {
          headerName: "RID",
          comparator: this.ridCompare,
          field: "attributes.rid"
        },
        {
          headerName: "External ID",
          field: "attributes.externalId"
        },
        {
          headerName: "Identifier",
          valueGetter: this.identifierGetter,
          cellStyle: { "line-height": "25px" },
          cellRenderer: function(param) {
            return param.value.join("<br style='line-height: 1px' />");
          }
        }
      ];
    }
  },
  watch: {
    /**
     * Resets row data on Substance Relationship List updates
     */
    list: function() {
      this.resetRowData();
    },

    /**
     * Loads the substance relationships for the currently loaded substance
     */
    substanceId: function() {
      if (this.substanceId) this.loadRecords();
    },

    /**
     * Handles the AG-Grid loading overlays when substance relationship loading starts and stops
     */
    loading: function() {
      this.manageOverlay();
    }
  },
  methods: {
    ...mapActions("alert", ["alert"]),
    ...mapActions("record", ["getList"]),

    /**
     * Loads Records by substance id.
     */
    loadRecords: function() {
      if (this.substanceId) {
        this.getList({
          params: [
            { key: "filter[substance.id]", value: this.substanceId },
            { key: "include", value: "identifiers,list" }
          ]
        });
      }
    },

    /**
     * Resets the row data to whatever is in the substance relationship store.
     * (the store should never be updated by this table)
     */
    resetRowData: function() {
      this.rowData = _.cloneDeep(this.list);
      this.gridOptions.api.refreshCells({
        force: true,
        suppressFlash: false
      });
    },

    /**
     * Allows the buttons to be interactive and the overlays to display
     * based on the state the data is in.
     */
    manageOverlay: function() {
      if (this.loading) {
        this.gridOptions.api.showLoadingOverlay();
      } else if (!this.loading && _.isEqual(this.list, [])) {
        this.gridOptions.api.showNoRowsOverlay();
      } else {
        this.gridOptions.api.hideOverlay();
      }
    },

    /**
     * Returns the list's label from the included data
     *
     * @param params - row data
     * @returns {string} - the list label for the selected row
     */
    listLabelGetter: function(params) {
      let relationship = params.data.relationships.list.data;
      return this.included?.[relationship.type]?.[relationship.id]?.attributes
        ?.label;
    },

    /**
     * Returns an array of record identifiers from the included data
     *
     * @param params - row data
     * @returns {array} - array of identifiers for the selected row
     */
    identifierGetter: function(params) {
      let relationships = params.data.relationships.identifiers.data;
      let identifierList = [];
      for (let relationship of relationships) {
        identifierList.push(
          this.included?.[relationship.type]?.[relationship.id]?.attributes
            ?.identifier
        );
      }
      return identifierList;
    },

    /**
     * Returns an int comparing two objects
     *
     * @param valueA - The id of object 1
     * @param valueB - The id of object 2
     * @returns {int} - 1 if object 1's label is first alphabetically otherwise -1
     */
    ridCompare: function(valueA, valueB) {
      let comparison = valueA.substring(8) > valueB.substring(8);
      return comparison ? 1 : -1;
    }
  },
  beforeMount() {
    // Load grid options
    this.gridOptions = {
      components: {
        mappableCellRenderer: MappableCellRenderer,
        selectObjectCellEditor: SelectObjectCellEditor
      }
    };

    // Load grid styling
    this.defaultColDef = {
      flex: 1,
      resizable: true,
      sortable: true,
      wrapText: true,
      autoHeight: true
    };
  },
  mounted() {
    // set the overlay based on the mounted state
    this.manageOverlay();
  }
};
</script>

<style scoped></style>
