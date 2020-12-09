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
        id="synonym-reset-button"
        @click="resetRowData"
        :disabled="!buttonsEnabled"
        >Reset</b-button
      >
      <b-button
        id="synonym-add-button"
        class="ml-1"
        variant="success"
        :disabled="!substanceId || loading"
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
} from "@/components/ag-grid/custom-renderers";
import BtnCellRenderer from "@/components/ag-grid/BtnCellRenderer"
import { HTTP } from "@/store/http-common";

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
        },
        {
          field: "data",
          cellRenderer: "btnCellRenderer",
          cellRendererParams: {
            clicked: function(value) {
              console.log(value);
            }
          },
        }
      ];
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
      selectedError: null,
      frameworkComponents: null,
      // Display options for error table.
      errorFields: [{ label: "Errors", key: "detail" }]
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
    ...mapActions("synonym", ["getList", "patch", "post"]),
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
        // todo: load pointer values
        this.selectedError = event.data.errors;
      }
    },

    /**
     * Clears the selected row.
     */
    clearSelected: function() {
      this.gridOptions.api.deselectAll();
      this.selectedError = null;
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
      }

      this.gridOptions.api.refreshCells({
        force: true,
        suppressFlash: false
      });
    },

    /**
     * Rebuilds rowData with a provided array of jsonapi compliant synonyms
     *
     * @param synonyms {array} - Array of jsonapi Synonym objects
     * @returns {array} - Array of agGrid rowData nodes.
     */
    buildRowData: function(synonyms) {
      let rowData = [];
      let data;

      for (let synonym of synonyms) {
        data = {
          identifier: synonym.attributes.identifier,
          qcNotes: synonym.attributes.qcNotes,
          synonymType: synonym.relationships.synonymType.data.id,
          synonymQuality: synonym.relationships.synonymQuality.data.id,
          source: synonym.relationships.source.data.id
        };

        rowData.push({
          id: synonym.id,
          data: { ...data },
          initialData: { ...data },
          errors: null,
          created: false
        });
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

      let data = {
        identifier: "",
        qcNotes: "",
        synonymType: null,
        synonymQuality: null,
        source: null
      };

      this.rowData.push({
        id: null,
        data: { ...data },
        initialData: { ...data },
        errors: null,
        created: true
      });
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
        row.errors = null;
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
        row.created = false;
        row.initialData = { ...row.data };
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
        ? this.post(requestBody)
            .then(onSuccess)
            .catch(onFailure)
        : this.patch({ id: row.id, body: { ...requestBody, id: row.id } })
            .then(onSuccess)
            .catch(onFailure);
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
        this.addAlert("This table cannot be edited", "warning");
        return;
      }

      // Clear selection for the sake of reloading error table
      this.clearSelected();

      // Stop editing (if a dropdown is selected but has not blurred,
      //               those changes should be considered valid)
      this.gridOptions.api.stopEditing();

      // Responses is an array of promises from the saved requests.
      // We need these all to finish before we can proceed.
      let responses = this.buildSaveRequests(this.rowData);

      // Wait for all save requests to finish
      await Promise.allSettled(responses).then(responses => {
        // Find failures
        let rejected = responses.filter(obj => {
          return obj.value.failed;
        });

        rejected.length === 0
          ? this.addAlert("All synonyms saved successfully", "success")
          : this.addAlert("Some synonyms could not be saved", "warning");
      });

      // Redraw rows to render error rows
      this.gridOptions.api.redrawRows();
    },

    /**
     * Loads synonyms by substance id.
     */
    loadSynonyms: async function(substanceId) {
      this.loading = true;

      let synonyms = [];
      if (substanceId)
        synonyms = await HTTP.get(
          `/synonyms?filter[substance.id]=${substanceId}`
        ).then(response => {
          return response.data.data;
        });

      this.loading = false;
      this.rowData = this.buildRowData(synonyms);
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
    }

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
