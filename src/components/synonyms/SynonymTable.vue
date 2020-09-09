<template>
  <div>
    <div v-show="selectedError" class="text-left">
      <b-table :items="selectedError" :fields="errorFields" borderless table-variant="danger"></b-table>
    </div>
    <ag-grid-vue
      style="height: 250px;"
      class="ag-theme-alpine"
      :columnDefs="columnDefs"
      :defaultColDef="defaultColDef"
      :rowData="rowData"
      :gridOptions="gridOptions"
      :rowClassRules="rowClassRules"
      @selection-changed="getSelectedError"
      rowSelection='single'
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
    // Substance ID to which these synonyms will be related
    substanceId: String
  },
  data() {
    return {
      originalData: null,
      rowData: null,
      defaultColDef: null,
      gridOptions: null,
      // Whether the save / reset buttons are enabled
      buttonsEnabled: false,
      // Rows that returned errors on save
      errorRows: {},
      // Currently selected error row.  Null if no errors
      selectedError: null,
      // Display options for error table.
      errorFields: [{label: "Errors", key: "detail"}],
    };
  },
  computed: {
    ...mapGetters("auth", ["isAuthenticated"]),
    ...mapState("synonym", ["list", "loading"]),
    ...mapState("source", { sourceList: "list" }),
    ...mapState("synonymQuality", { qualityList: "list" }),
    ...mapState("synonymType", { typeList: "list" }),

    /**
     * Defines the columns to be used in ag grid table
     */
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

    /**
     * Row highlighting rules
     */
    rowClassRules: function() {
      return {
        // background danger any rows where the id is within the errorRows object
        "bg-danger": params => {
          return this.errorRows.hasOwnProperty(params.data.id);
        }
      };
    },

    /**
     * Synonym objects to be looked up by id.  (used to verify changes)
     */
    synonymListMap: function() {
      let map = {};
      for (let synonym of this.list) map[synonym.id] = synonym;
      return map;
    },

    /**
     * Source objects to be used in a select dropdown
     */
    sourceListOptions: function() {
      return this.sourceList.map(i => {
        return { value: i.id, text: i.attributes.label };
      });
    },

    /**
     * Source objects to be looked up by id.  (used in cell renderers from id)
     */
    sourceListMap: function() {
      let map = {};
      for (let source of this.sourceList) map[source.id] = { ...source };
      return map;
    },

    /**
     * Synonym Quality objects to be used in a select dropdown
     */
    qualityListOptions: function() {
      return this.qualityList.map(i => {
        return { value: i.id, text: i.attributes.label };
      });
    },

    /**
     * Synonym Quality objects to be looked up by id.  (used in cell renderers from id)
     */
    qualityListMap: function() {
      let map = {};
      for (let quality of this.qualityList) map[quality.id] = { ...quality };
      return map;
    },

    /**
     * Synonym Type objects to be used in a select dropdown
     */
    typeListOptions: function() {
      return this.typeList.map(i => {
        return { value: i.id, text: i.attributes.label };
      });
    },

    /**
     * Synonym Type objects to be looked up by id.  (used in cell renderers from id)
     */
    typeListMap: function() {
      let map = {};
      for (let type of this.typeList) map[type.id] = { ...type };
      return map;
    }
  },
  watch: {
    /**
     * Resets row data on Synonym List update
     */
    list: function() {
      this.resetRowData();
    },

    /**
     * Loads the synonyms for the currently loaded substance
     */
    substanceId: function() {
      if (this.substanceId) this.loadSynonyms();
    },

    /**
     * Handles the AG-Grid loading overlays when synonym loading starts and stops
     */
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

    /**
     * Resets the row data to whatever is in the synonym store.
     * (the synonym store should never be updated by this table)
     */
    resetRowData: function() {
      this.rowData = _.cloneDeep(this.list);
      this.gridOptions.api.refreshCells({
        force: true,
        suppressFlash: false
      });
    },

    /**
     * Saves all updated rows.
     *
     * If all rows update correctly alerts the user with a success prompt.
     *
     * If some rows fail to update, those object ids are added to an object.
     * with their error details.  The app can then display those errors when
     * the failing row is selected
     *
     * todo: This function is asynchronous.  If we had a loading overlay it would
     * work well here.
     */
    save: async function() {
      // Stop editing (if a dropdown is selected but has not blurred,
      //               those changes should be considered valid)
      this.gridOptions.api.stopEditing()
      // Responses is an array of promises from the patch requests.
      // We need these all to finish before we can proceed.
      let responses = [];

      this.selectedError = null

      for (let row of this.rowData) {
        if (!_.isEqual(row, this.synonymListMap[row.id])) {
          // Patch this object and save the response to the response promise array.
          // If the patch fails, catch the failure and return information regarding why.
          responses.push(
            this.patch({ id: row.id, body: row }).catch(
              err => {
                return {
                  failed: true,
                  body: row,
                  errors: err.response.data.errors
                };
              }
            )
          );
        }
      }

      // Wait for all patches to finish
      await Promise.allSettled(responses).then(responses => {
        // Find failures
        let rejected = responses.filter(obj => {
          return obj.value.failed;
        });
        this.errorRows = {};
        // If there are none,
        if (rejected.length === 0) {
          // update the user with the success
          this.alert({
            message: "All synonyms saved successfully",
            color: "success",
            dismissCountDown: 15
          });
        }
        // if there are errors
        else {
          // Update error rows object with an { id: error }
          for (let reject of rejected) {
            this.errorRows[reject.value.body.id] = reject.value.errors;
          }
          // Alert the user that some errors happened
          this.alert({
            message: "Some synonyms could not be saved.",
            color: "warning",
            dismissCountDown: 15
          });
        }
      });
      // scroll to the top of the page so the user sees the alert
      window.scrollTo(0, 0);

      // Reload the updated data from the DB.
      this.loadSynonyms();
    },

    /**
     * Loads synonyms by substance id.
     */
    loadSynonyms: function() {
      this.getList({
        params: [{ key: "filter[substance.id]", value: this.substanceId }]
      });
    },

    /**
     * Allows the buttons to be interactive and the overlays to display
     * based on the state the data is in.
     */
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
    },

    /**
     * Sets the selected error to the selected row's error.  Otherwise returns null
     */
    getSelectedError: function() {
      this.selectedError = this.errorRows[this.gridOptions.api.getSelectedRows()[0].id] ?? null
    },
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
      editable: true,
      resizable: true
    };
  },
  mounted() {
    // set the overlay based on the mounted state
    this.manageOverlay();

    // Load related info
    this.loadQualityList();
    this.loadSourceList();
    this.loadTypeList();
  }
};
</script>

<style scoped></style>
