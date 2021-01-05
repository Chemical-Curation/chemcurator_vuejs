import _ from "lodash";
import { mapActions } from "vuex";
import {
  MappableCellRenderer,
  SelectObjectCellEditor
} from "@/components/ag-grid/custom-renderers";
import BtnCellRenderer from "@/components/ag-grid/BtnCellRenderer";

export const agGridMixin = {
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

  watch: {
    /**
     * Handles the AG-Grid loading overlays when synonym loading starts and stops
     */
    loading: function() {
      this.manageOverlay();
    }
  },

  computed: {
    columnDefs: function() {
      return [];
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
    }
  },

  methods: {
    ...mapActions("alert", ["alert"]),

    /** todo: Clean up this doc
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
    buildRowData: function(jsonapiArray) {
      let rowData = [];
      for (let jsonapiObject of jsonapiArray) {
        rowData.push(this.toRowData(jsonapiObject));
      }
      return rowData;
    },

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

    saveRow: async function(params) {
      await this.saveRequest(params.data);
      this.gridOptions.api.redrawRows();
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

    getEditButtons: function() {
      let buttons = [];

      if (this.editable) {
        // Add the save button
        buttons.push({
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
        buttons.push({
          flex: 0,
          width: 85,
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

      return buttons;
    }
  }
};
