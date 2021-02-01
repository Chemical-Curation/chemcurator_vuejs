import _ from "lodash";
import BtnCellRenderer from "@/components/ag-grid/BtnCellRenderer";
import RelationshipTypeCellRenderer from "@/components/ag-grid/RelationshipTypeCellRenderer";
import RelationshipTypeCellEditor from "@/components/ag-grid/RelationshipTypeCellEditor";
import MappableCellRenderer from "@/components/ag-grid/MappableCellRenderer";
import SelectObjectCellEditor from "@/components/ag-grid/SelectObjectCellEditor";

export const agGridMixin = {
  data() {
    return {
      rowData: [],
      defaultColDef: null,
      gridOptions: {},
      loading: false,
      selectedRow: null,
      frameworkComponents: null
    };
  },

  beforeMount() {
    // Load grid options
    this.frameworkComponents = {
      selectObjectCellEditor: SelectObjectCellEditor,
      mappableCellRenderer: MappableCellRenderer,
      btnCellRenderer: BtnCellRenderer,
      relationshipTypeCellRenderer: RelationshipTypeCellRenderer,
      relationshipTypeCellEditor: RelationshipTypeCellEditor
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
      return this.selectedRow?.errors ?? [];
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
    /**
     * Rebuilds rowData with a provided array of jsonapi compliant synonyms
     *
     * @param jsonapiArray {array} - Array of JsonAPI objects
     * @returns {array} - Array of agGrid rowData nodes.
     */
    buildRowData: function(jsonapiArray) {
      let rowData = [];
      for (let jsonapiObject of jsonapiArray) {
        rowData.push(this.toRowData(jsonapiObject));
      }
      return rowData;
    },

    countDownChanged: function(countdown) {
      this.alert.timer = countdown;
    },

    /**
     * Adds an alert to the an alert box
     * todo: If the top of the page is visible,
     *       the state alert might be better than this approach
     */
    addAlert(message, style) {
      this.alert.message = message;
      this.alert.style = style;
      this.alert.timer = this.maxTimer;
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
