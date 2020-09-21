<template>
  <div>
    <div class="text-left">
      <h3>Substance Relationships</h3>
    </div>
    <ag-grid-vue
      id="substanceRelationshipTable"
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
        id="relationship-error-table"
        :items="selectedError"
        :fields="errorFields"
        borderless
        table-variant="danger"
      ></b-table>
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

/**
 * Render the SID of a substance from a substance relationship
 * based on whether the provided substance id is in the "to" or "from" substance
 *
 * This cell Renderer is specific enough to not be reusable.
 */
function SubstanceRelationshipSIDCellRenderer() {}
SubstanceRelationshipSIDCellRenderer.prototype.init = function(params) {
  this.eGui = document.createElement("span");
  if (params.data.relationships.fromSubstance.data.id === params.substanceId) {
    let substanceData = params.data.relationships.toSubstance.data;
    this.eGui.innerHTML =
      params.included[substanceData.type][substanceData.id].attributes.sid;
  } else {
    let substanceData = params.data.relationships.fromSubstance.data;
    this.eGui.innerHTML =
      params.included[substanceData.type][substanceData.id].attributes.sid;
  }
};
SubstanceRelationshipSIDCellRenderer.prototype.getGui = function() {
  return this.eGui;
};

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
      errorFields: [{ label: "Errors", key: "detail" }]
    };
  },
  computed: {
    ...mapGetters("auth", ["isAuthenticated"]),
    ...mapState("substanceRelationship", ["list", "loading", "included"]),
    ...mapState("source", { sourceList: "list" }),
    ...mapState("relationshipType", { relationshipTypeList: "list" }),

    /**
     * Defines the columns to be used in ag grid table
     */
    columnDefs: function() {
      return [
        {
          headerName: "SID",
          cellRenderer: SubstanceRelationshipSIDCellRenderer,
          cellRendererParams: {
            substanceId: this.substanceId,
            included: this.included
          }
        },
        {
          headerName: "Source",
          field: "relationships.source.data.id",
          comparator: this.sourceMapCompare,
          cellRenderer: "mappableCellRenderer",
          cellRendererParams: {
            map: this.sourceListMap
          }
        },
        {
          headerName: "Type",
          field: "relationships.relationshipType.data.id",
          comparator: this.typeMapCompare,
          cellRenderer: "mappableCellRenderer",
          cellRendererParams: {
            map: this.typeListMap
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
      for (let source of this.sourceList) map[source.id] = source;
      return map;
    },

    /**
     * Relationship Type objects to be used in a select dropdown
     */
    typeListOptions: function() {
      return this.relationshipTypeList.map(i => {
        return { value: i.id, text: i.attributes.label };
      });
    },

    /**
     * Relationship Type objects to be looked up by id.  (used in cell renderers from id)
     */
    typeListMap: function() {
      let map = {};
      for (let type of this.relationshipTypeList) map[type.id] = type;
      return map;
    }
  },
  watch: {
    /**
     * Loads the relationships for the currently loaded substance
     */
    substanceId: function() {
      if (this.substanceId) this.loadSubstanceRelationships();
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
    ...mapActions("substanceRelationship", ["getList", "patch"]),
    ...mapActions("relationshipType", { loadRelationshipTypeList: "getList" }),
    ...mapActions("source", { loadSourceList: "getList" }),

    /**
     * Loads synonyms by substance id.
     */
    loadSubstanceRelationships: function() {
      this.getList({
        params: [
          { key: "filter[substance.id]", value: this.substanceId },
          { key: "include", value: "fromSubstance,toSubstance" }
        ]
      });
      this.rowData = _.cloneDeep(this.list);
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
      this.selectedError =
        this.errorRows[this.gridOptions?.api.getSelectedRows()[0].id] ?? null;
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
      editable: this.isAuthenticated,
      resizable: true,
      sortable: true
    };
  },
  mounted() {
    // set the overlay based on the mounted state
    this.manageOverlay();

    // Load related info
    this.loadSubstanceRelationships();
    this.loadRelationshipTypeList();
    // sources are loaded on the substance page.
    // This is redundant but will be required if reuse this component.
    // this.loadSourceList();
  }
};
</script>

<style scoped></style>
