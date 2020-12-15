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
      :frameworkComponents="frameworkComponents"
      @row-selected="onRowSelected"
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
        id="synonym-add-button"
        class="ml-1"
        variant="success"
        :disabled="!substanceId || loading"
        @click="addSynonym"
      >
        Add Synonym
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
} from "@/components/ag-grid/custom-renderers";
import BtnCellRenderer from "@/components/ag-grid/BtnCellRenderer";
import SynonymApi from "@/api/synonym.js";

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
    ...mapState("source", { sourceList: "list" }),
    ...mapState("synonymQuality", { qualityList: "list" }),
    ...mapState("synonymType", { typeList: "list" }),

    /**
     * Defines the columns to be used in ag grid table
     */
    columnDefs: function() {
      let colDefs = [
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
      if (this.editable) {
        // Add the save button
        colDefs.push({
          flex: 0,
          width: 85,
          resizable: false,
          sortable: false,
          editable: false,
          headerName: "",
          cellClass: "p-0 text-center",
          cellRenderer: "btnCellRenderer",
          cellRendererParams: {
            clicked: this.saveRow,
            buttonText: "Save",
            buttonVariant: "primary",
            enabled: function(data) {
              return !_.isEqual(data.data, data.initialData);
            }
          }
        });
        // Add the delete button
        colDefs.push({
          flex: 0,
          width: 75,
          resizable: false,
          sortable: false,
          editable: false,
          headerName: "",
          cellClass: "p-0 text-center",
          cellRenderer: "btnCellRenderer",
          cellRendererParams: {
            clicked: this.deleteRow,
            buttonText: "Delete",
            buttonVariant: "danger",
            enabled: function() {
              return true;
            } // delete is always available
          }
        });
      }
      return colDefs;
    },

    /**
     * Row highlighting rules
     */
    rowClassRules: function() {
      return {
        // background danger any rows have errors
        "bg-danger": params => {
          return params.data.errors;
        },
        // background info any rows where there is no id
        "new-ag-row": params => {
          // new-ag-row is currently an unscoped style.
          // It naturally takes a position below ag-grid's row style
          // and thus needs an important tag.
          return params.data.created && !params.data.errors;
        }
      };
    },

    selectedError: function() {
      if (this.selectedRow?.errors)
        return this.selectedRow.errors.map(error => {
          error.modifiedDetail = this.buildErrorString(error);
          return error;
        });
      return null;
    },

    /**
     * Checks for any row additions/edits and returns a bool
     *
     * @return {boolean} - True if any row has changed, false if not.
     */
    buttonsEnabled: function() {
      for (let row of this.rowData) {
        if (!_.isEqual(row.data, row.initialData) || row.created) return true;
      }
      return false;
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
      rowData: [],
      defaultColDef: null,
      gridOptions: null,
      loading: false,
      selectedRow: null,
      frameworkComponents: null,
      // Display options for error table.
      errorFields: [{ label: "Errors", key: "modifiedDetail" }]
    };
  },
  watch: {
    /**
     * Loads the synonyms for the currently loaded substance
     */
    substanceId: function() {
      this.loadSynonyms(this.substanceId);
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
    ...mapActions("synonymQuality", { loadQualityList: "getList" }),
    ...mapActions("synonymType", { loadTypeList: "getList" }),
    ...mapActions("source", { loadSourceList: "getList" }),

    /**
     * Adds an alert to the page and scrolls the user to the top of the page
     * so they can see it.
     */
    addAlert(message, color) {
      this.alert({
        message: message,
        color: color,
        dismissCountDown: 15
      });
      window.scrollTo(0, 0);
    },

    /**
     * Sets this.selectedError to the currently selected row.
     */
    onRowSelected: function(event) {
      if (event.node.isSelected()) {
        this.selectedRow = event.data;
      }
    },

    /**
     * Turns a row specific error into readable text
     *
     * Prepends a title case of the pointer's attribute to the error string if the error is
     * field specific.  Pointer values of "nonFieldErrors" will be ignored.
     *
     * @param error {Object}: JsonAPI error object containing error detail string and a source.pointer
     *     Example JsonAPI error
     *     {
     *       detail: "This field is required"
     *       status: "400"
     *       source: { pointer: "data/attributes/synonymQuality" }
     *       code: "required"
     *     }
     * @returns {string}: Modified error string.
     *     From above example "Synonym Quality: This field is required"
     */
    buildErrorString: function(error) {
      let readableDetails = error.detail;

      if (error?.source?.pointer) {
        let pointerField = error.source.pointer
          .split("/")
          .slice(-1)
          .shift();
        if (pointerField !== "nonFieldErrors") {
          let result = pointerField.replace(/([A-Z])/g, " $1");
          let finalResult = result.charAt(0).toUpperCase() + result.slice(1);
          readableDetails = finalResult + ": " + readableDetails;
        }
      }
      return readableDetails;
    },

    /**
     * Clears the selected row.
     */
    clearSelected: function() {
      this.gridOptions.api.deselectAll();
    },

    /**
     * Resets the row data to whatever is in the synonym store.
     * (the synonym store should never be updated by this table)
     */
    resetRowData: function() {
      this.clearSelected();

      // Reset created rows
      this.rowData = this.rowData.filter(row => {
        return !row.created;
      });

      // Reset modified rows
      for (let row of this.rowData) {
        row.data = { ...row.initialData };
        row.errors = null;
      }

      this.gridOptions.api.refreshCells({
        force: true,
        suppressFlash: false
      });
    },

    /**
     * Rebuilds rowData with a provided array of jsonapi compliant synonyms
     *
     * @param synonyms {array} - Array of JsonAPI Synonym objects
     *     Sample JsonAPI Synonym
     *     {
     *       id: "string"
     *       attributes: { identifier: "string", qcNotes: "string" },
     *       relationships: {
     *         substance: {
     *           data: { type: "substance", id: "string" }
     *         },
     *         source: {
     *           data: { type: "source", id: "string" }
     *         },
     *         synonymQuality: {
     *           data: { type: "synonymQuality", id: "string" }
     *         },
     *         synonymType: {
     *           data: { type: "synonymType", id: "string" }
     *         },
     *       }
     *     }
     * @returns {array} - Array of agGrid rowData nodes.
     */
    buildRowData: function(synonyms) {
      let rowData = [];
      for (let synonym of synonyms) {
        rowData.push(this.toRowData(synonym));
      }
      return rowData;
    },

    /**
     * Adds a new synonym to this.rowData
     */
    addSynonym: function() {
      if (!this.substanceId) {
        this.addAlert("Please load a substance", "warning");
        return;
      }
      this.rowData.unshift(this.toRowData(null));
    },

    /**
     * Rebuilds rowData with a provided array of jsonapi compliant synonyms
     *
     * @param synonym {Object} - JsonAPI formatted synonym or null
     *     Sample JsonAPI Synonym
     *     {
     *       id: "string"
     *       attributes: { identifier: "string", qcNotes: "string" },
     *       relationships: {
     *         substance: {
     *           data: { type: "substance", id: "string" }
     *         },
     *         source: {
     *           data: { type: "source", id: "string" }
     *         },
     *         synonymQuality: {
     *           data: { type: "synonymQuality", id: "string" }
     *         },
     *         synonymType: {
     *           data: { type: "synonymType", id: "string" }
     *         },
     *       }
     *     }
     * @returns {Object} - agGrid rowData node.
     *     Sample rowData node
     *     {
     *       id: "string",  The synonym's id or null
     *       data: { identifier, qcNotes, synonymType, synonymQuality, source }, The synonyms rendered field data
     *       initialData: { identifier, qcNotes, synonymType, synonymQuality, source }, The synonyms initial field data
     *       errors: {detail, status, source: { pointer: "string"}, code },  Any save errors as error objects
     *       created: Boolean(synonym?.id)  // True if this is a new, unsaved row
     *     }
     */
    toRowData: function(synonym) {
      let data = {
        identifier: synonym?.attributes?.identifier ?? "",
        qcNotes: synonym?.attributes?.qcNotes ?? "",
        synonymType: synonym?.relationships?.synonymType?.data?.id ?? null,
        synonymQuality:
          synonym?.relationships?.synonymQuality?.data?.id ?? null,
        source: synonym?.relationships?.source?.data?.id ?? null
      };

      return {
        id: synonym?.id ?? null,
        data: { ...data },
        initialData: { ...data },
        errors: null,
        created: !synonym?.id // if there is no id, this row is considered "new".
      };
    },

    /**
     * Loops through all rows, checks for changes, and returns promises
     * to attempt to update each changed row.
     *
     * @returns {Array} - Array of promises corresponding to each updated/created row
     */
    buildSaveRequests: function() {
      let responses = [];

      for (let row of this.rowData) {
        // Clear previous errors
        if (!_.isEqual(row.data, row.initialData)) {
          responses.push(this.saveRequest(row));
        }
      }

      return responses;
    },

    /**
     * Builds an update/save request for a single row
     *
     * @param row {obj} - rowData object
     * @returns {Promise} - API request for a single row.
     *    - On success the row will have created set to false and
     *      initialData updated to reflect the current data.
     *    - On failure the errors will be added to the row.
     */
    saveRequest: function(row) {
      // Local functions to deal with successful saves and failures
      function onSuccess(res) {
        // Save the id of the potentially newly minted row.
        row.id = res.data.data.id;
        row.created = false;
        row.initialData = { ...row.data };
        row.errors = null;
        return res;
      }

      function onFailure(err) {
        row.errors = err.response.data.errors;
        return {
          failed: true
        };
      }

      let requestBody = this.buildRequestBody(row.data);

      return row.created
        ? SynonymApi.post(requestBody)
            .then(onSuccess)
            .catch(onFailure)
        : SynonymApi.patch({ id: row.id, body: { ...requestBody, id: row.id } })
            .then(onSuccess)
            .catch(onFailure);
    },

    /**
     * Deletes a single row
     *
     * @param row {obj} - rowData object
     * @returns {Promise} - Deletes a row
     */
    deleteRow: function(row) {
      if (!row.data.created) {
        SynonymApi.delete(row.data.id)
          .then(() => {
            this.gridOptions.rowData.splice(row.rowIndex, 1);
          })
          .catch(err => {
            row.data.errors = err.response.data.errors;
          });
      } else this.gridOptions.rowData.splice(row.rowIndex, 1);

      this.gridOptions.api.redrawRows();
    },

    saveRow: async function(params) {
      await this.saveRequest(params.data);
      this.gridOptions.api.redrawRows();
    },

    /**
     * Loads synonyms by substance id.
     */
    loadSynonyms: async function(substanceId) {
      this.loading = true;

      let synonyms = [];
      if (substanceId)
        synonyms = await SynonymApi.list({
          params: [{ key: "filter[substance.id]", value: substanceId }]
        }).then(res => {
          return res.data.data;
        });

      this.rowData = this.buildRowData(synonyms);
      this.loading = false;
    },

    /**
     * Allows the buttons to be interactive and the overlays to display
     * based on the state the data is in.
     */
    manageOverlay: function() {
      if (this.loading) {
        this.gridOptions.api.showLoadingOverlay();
      } else if (!this.loading && _.isEqual(this.rowData, [])) {
        this.gridOptions.api.showNoRowsOverlay();
      } else {
        this.gridOptions.api.hideOverlay();
      }
    },

    /**
     * Transforms rowData.data into a jsonapi compliant body.
     *
     * @param data - rowData.data object
     * @returns {obj} - Jsonapi formatted create request body
     */
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
    this.frameworkComponents = {
      btnCellRenderer: BtnCellRenderer
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
    this.loadSynonyms(this.substanceId);
    if (this.gridOptions.api)
      this.gridOptions.api.refreshCells({
        force: true,
        suppressFlash: false
      });

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
