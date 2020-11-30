<template>
  <div class="mb-5">
    <div class="text-left">
      <h3>Synonyms</h3>
    </div>
    <ag-grid-vue
      id="substanceTable"
      style="height: 250px;"
      class="ag-theme-alpine"
      :columnDefs="columnDefs"
      :defaultColDef="defaultColDef"
      :rowData="rowData"
      :gridOptions="gridOptions"
      :rowClassRules="rowClassRules"
      @selection-changed="getSelectedError"
      rowSelection="single"
    />
    <div v-show="selectedError" class="mt-3 text-left">
      <b-table
        id="synonym-error-table"
        :items="selectedError"
        :fields="errorFields"
        borderless
        table-variant="danger"
      ></b-table>
    </div>
    <div class="d-flex flex-row justify-content-end my-3" v-if="editable">
      <b-button
        id="synonym-reset-button"
        @click="resetRowData"
        :disabled="!buttonsEnabled"
        >Reset</b-button
      >
      <b-button
        id="synonym-add-button"
        class="ml-1"
        variant="success"
        :disabled="!substanceId"
        @click="addSynonym"
      >
        Add Synonym
      </b-button>
      <b-button
        id="synonym-save-button"
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
  name: "agSynonymTable",
  components: {
    AgGridVue
  },
  props: {
    // Substance ID to which these synonyms will be related
    substanceId: String,
    editable: Boolean
  },
  computed: {
    ...mapGetters("auth", ["isAuthenticated"]),
    ...mapGetters("synonymQuality", { qualityListOptions: "getOptions" }),
    ...mapGetters("source", { sourceListOptions: "getOptions" }),
    ...mapGetters("synonymType", { typeListOptions: "getOptions" }),
    ...mapState("synonym", ["list", "loading"]),
    ...mapState("source", { sourceList: "list" }),
    ...mapState("synonymQuality", { qualityList: "list" }),
    ...mapState("synonymType", { typeList: "list" }),

    /**
     * Defines the columns to be used in ag grid table
     */
    columnDefs: function() {
      return [
        { headerName: "Identifier", field: "data.identifier" },
        {
          headerName: "Source",
          field: "data.source",
          comparator: this.sourceMapCompare,
          cellRenderer: "mappableCellRenderer",
          cellRendererParams: {
            map: this.sourceListMap
          },
          cellEditor: "selectObjectCellEditor",
          cellEditorParams: {
            cellRenderer: "mappableCellRenderer",
            values: this.sourceListOptions("relationships.source.data.id")
          }
        },
        {
          headerName: "Quality",
          field: "data.synonymQuality",
          comparator: this.qualityMapCompare,
          cellRenderer: "mappableCellRenderer",
          cellRendererParams: {
            map: this.qualityListMap
          },
          cellEditor: "selectObjectCellEditor",
          cellEditorParams: {
            cellRenderer: "mappableCellRenderer",
            values: this.qualityListOptions(
              "relationships.synonymQuality.data.id"
            )
          }
        },
        {
          headerName: "Type",
          field: "data.synonymType",
          comparator: this.typeMapCompare,
          cellRenderer: "mappableCellRenderer",
          cellRendererParams: {
            map: this.typeListMap
          },
          cellEditor: "selectObjectCellEditor",
          cellEditorParams: {
            cellRenderer: "mappableCellRenderer",
            values: this.typeListOptions("relationships.synonymType.data.id")
          }
        },
        {
          headerName: "QC Notes",
          field: "data.qcNotes",
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
          return params.data.errors.length;
        },
        // background info any rows where there is no id
        "new-ag-row": params => {
          return params.data.created && !params.data.errors.length;
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
     * Source objects to be looked up by id.  (used in cell renderers from id)
     */
    sourceListMap: function() {
      let map = {};
      for (let source of this.sourceList) map[source.id] = source;
      return map;
    },

    /**
     * Synonym Quality objects to be looked up by id.  (used in cell renderers from id)
     */
    qualityListMap: function() {
      let map = {};
      for (let quality of this.qualityList) map[quality.id] = quality;
      return map;
    },

    /**
     * Synonym Type objects to be looked up by id.  (used in cell renderers from id)
     */
    typeListMap: function() {
      let map = {};
      for (let type of this.typeList) map[type.id] = type;
      return map;
    }
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
      // Rows that failed to create
      failedCreates: [],
      // Currently selected error row.  Null if no errors
      selectedError: null,
      // Display options for error table.
      errorFields: [{ label: "Errors", key: "detail" }]
    };
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
    ...mapActions("synonym", ["getList", "patch", "post"]),
    ...mapActions("synonymQuality", { loadQualityList: "getList" }),
    ...mapActions("synonymType", { loadTypeList: "getList" }),
    ...mapActions("source", { loadSourceList: "getList" }),

    /**
     * Resets the row data to whatever is in the synonym store.
     * (the synonym store should never be updated by this table)
     */
    resetRowData: function() {
      this.buttonsEnabled = false;
      this.rowData = this.buildRowData(this.list);

      // for (let failedCreate of this.failedCreates) {
      //   this.rowData.push({ ...failedCreate });
      // }
      //
      // // todo: this is brittle
      // this.failedCreates = [];

      this.gridOptions.api.refreshCells({
        force: true,
        suppressFlash: false
      });
    },

    buildRowData: function(synonyms) {
      let rowData = [];

      for (let synonym of synonyms) {
        rowData.push({
          id: synonym.id,
          data: {
            identifier: synonym.attributes.identifier,
            qcNotes: synonym.attributes.qcNotes,
            synonymType: synonym.relationships.synonymType.data.id,
            synonymQuality: synonym.relationships.synonymQuality.data.id,
            source: synonym.relationships.source.data.id
          },
          initialData: {
            identifier: synonym.attributes.identifier,
            qcNotes: synonym.attributes.qcNotes,
            synonymType: synonym.relationships.synonymType.data.id,
            synonymQuality: synonym.relationships.synonymQuality.data.id,
            source: synonym.relationships.source.data.id
          },
          errors: [],
          created: false
        });
      }

      return rowData;
    },

    /**
     * Adds a synonym.
     *
     */
    addSynonym: function() {
      if (!this.substanceId) {
        this.alert({
          message: "Please load a substance",
          color: "warning",
          dismissCountDown: 15
        });
        window.scrollTo(0, 0);
        return;
      }

      this.buttonsEnabled = true;
      if (!this.rowData) this.rowData = [];

      this.rowData.push({
        id: null,
        data: {
          identifier: "",
          qcNotes: "",
          synonymType: null,
          synonymQuality: null,
          source: null
        },
        initialData: {
          identifier: "",
          qcNotes: "",
          synonymType: null,
          synonymQuality: null,
          source: null
        },
        errors: [],
        created: true
      });
    },

    buildSaveRequests: function() {
      let responses = [];

      for (let row of this.rowData) {
        if (!_.isEqual(row.data, row.initialData)) {
          let requestBody = this.buildRequestBody(row.data);

          if (row.created) {
            responses.push(
              this.post(requestBody).catch(err => {
                row["errors"] = err.response.data.errors;
                row["hasErrors"] = Boolean(err.response.data.errors.length);
                return {
                  failed: true
                };
              })
            );
          } else {
            // Patch this object and save the response to the response promise array.
            // If the patch fails, catch the failure and return information regarding why.
            responses.push(
              this.patch({
                id: row.id,
                body: { ...requestBody, id: row.id }
              }).catch(err => {
                row["errors"] = err.response.data.errors;
                row["hasErrors"] = Boolean(err.response.data.errors.length);
                return {
                  failed: true
                };
              })
            );
          }
        }
      }

      return responses;
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
      if (!this.editable) {
        this.alert({
          message: "This table cannot be edited",
          color: "warning",
          dismissCountDown: 15
        });
        window.scrollTo(0, 0);
        return;
      }

      // Stop editing (if a dropdown is selected but has not blurred,
      //               those changes should be considered valid)
      this.gridOptions.api.stopEditing();
      // Responses is an array of promises from the patch requests.
      // We need these all to finish before we can proceed.
      let responses = this.buildSaveRequests(this.rowData);

      // Wait for all patches to finish
      await Promise.allSettled(responses).then(responses => {
        // Find failures
        let rejected = responses.filter(obj => {
          return obj.value.failed;
        });
        // If there are none,
        if (rejected.length === 0) {
          // update the user with the success
          this.alert({
            message: "All synonyms saved successfully",
            color: "success",
            dismissCountDown: 15
          });

          // todo : Fragile.
          this.loadSynonyms();
        }
        // if there are errors
        else {
          // Alert the user that some errors happened
          this.alert({
            message: "Some synonyms could not be saved",
            color: "warning",
            dismissCountDown: 15
          });
        }
      });

      // Redraw rows to render error rows
      this.gridOptions.api.redrawRows();

      // scroll to the top of the page so the user sees the alert
      window.scrollTo(0, 0);
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
      let errorList = this.gridOptions.api.getSelectedRows()[0]?.errors;
      this.selectedError = errorList.length ? errorList : null;
    },

    buildRequestBody: function(data) {
      let requestBody = {
        type: "synonym",
        attributes: {
          identifier: data.identifier,
          qcNotes: data.qcNotes
        },
        relationships: {
          substance: {
            data: {
              id: this.substanceId,
              type: "substance"
            }
          }
        }
      };
      for (let relationship of ["source", "synonymType", "synonymQuality"]) {
        if (data[relationship])
          requestBody["relationships"][relationship] = {
            data: { type: relationship, id: data[relationship] }
          };
      }
      return requestBody;
    },

    /**
     * Returns a boolean comparing the map.attribute.labels for two objects
     *
     * @param valueA - The id of object 1
     * @param valueB - The id of object 2
     * @returns {int} - 1 if object 1's label is first alphabetically otherwise -1
     */
    sourceMapCompare: function(valueA, valueB) {
      let comparison =
        this.sourceListMap[valueA].attributes.label.toLowerCase() >
        this.sourceListMap[valueB].attributes.label.toLowerCase();
      return comparison ? 1 : -1;
    },

    /**
     * Returns a boolean comparing the map.attribute.labels for two objects
     *
     * @param valueA - The id of object 1
     * @param valueB - The id of object 2
     * @returns {int} - 1 if object 1's label is first alphabetically otherwise -1
     */
    qualityMapCompare: function(valueA, valueB) {
      let comparison =
        this.qualityListMap[valueA].attributes.label.toLowerCase() >
        this.qualityListMap[valueB].attributes.label.toLowerCase();
      return comparison ? 1 : -1;
    },

    /**
     * Returns a boolean comparing the map.attribute.labels for two objects
     *
     * @param valueA - The id of object 1
     * @param valueB - The id of object 2
     * @returns {boolean} - 1 if object 1's label is first alphabetically otherwise -1
     */
    typeMapCompare: function(valueA, valueB) {
      let comparison =
        this.typeListMap[valueA].attributes.label.toLowerCase() >
        this.typeListMap[valueB].attributes.label.toLowerCase();
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
      editable: this.editable,
      resizable: true,
      sortable: true
    };
  },
  mounted() {
    // set the overlay based on the mounted state
    this.manageOverlay();

    // Load related info
    this.loadQualityList();
    this.loadTypeList();
    // sources are loaded on the substance page.
    // This is redundant but will be required if reuse this component.
    // this.loadSourceList();
  }
};
</script>

<style>
.ag-row.new-ag-row {
  background-color: #def2ff !important;
}
</style>
