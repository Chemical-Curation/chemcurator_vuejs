<template>
  <div>
    <div class="d-flex justify-content-between text-left">
      <h3>Synonyms</h3>
      <b-button
        v-b-modal.bulk-add-synonyms-modal
        variant="success"
        :disabled="!substanceId || loading"
        class="mb-2"
        >Bulk Add Synonyms</b-button
      >
    </div>
    <ag-grid-vue
      id="synonym-table"
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
    <div v-show="selectedError.length > 0" class="mt-3 text-left">
      <error-table
        :errors="selectedError"
        id="synonym-error-table"
      ></error-table>
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
    <b-modal
      id="bulk-add-synonyms-modal"
      title="Bulk Add Synonyms"
      size="lg"
      hide-footer
    >
      <BulkAddSynonyms
        :substance-id="substanceId"
        @save="loadSynonyms(substanceId)"
      >
      </BulkAddSynonyms>
    </b-modal>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";
import { AgGridVue } from "ag-grid-vue";
import SynonymApi from "@/api/synonym.js";
import { agGridMixin } from "@/components/ag-grid/agGridMixin";
import BulkAddSynonyms from "@/components/synonyms/BulkAddSynonyms";
import ErrorTable from "@/components/ErrorTable";

export default {
  name: "agSynonymTable",
  components: {
    ErrorTable,
    BulkAddSynonyms,
    AgGridVue
  },
  mixins: [agGridMixin],
  props: {
    // Substance ID to which these synonyms will be related
    substanceId: String,
    editable: Boolean
  },
  computed: {
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
      colDefs = colDefs.concat(this.getEditButtons());
      return colDefs;
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

  watch: {
    /**
     * Loads the synonyms for the currently loaded substance
     */
    substanceId: function() {
      this.loadSynonyms(this.substanceId);
    }
  },
  methods: {
    ...mapActions("synonymQuality", { loadQualityList: "getList" }),
    ...mapActions("synonymType", { loadTypeList: "getList" }),
    ...mapActions("source", { loadSourceList: "getList" }),

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
      let onSuccess = res => {
        // Save the id of the potentially newly minted row.
        row.id = res.data.data.id;
        row.created = false;
        row.initialData = { ...row.data };
        row.errors = null;

        this.addAlert(`${row.data.identifier} was saved`, "success");

        return res;
      };

      let onFailure = err => {
        row.errors = err.response.data.errors;
        return {
          failed: true
        };
      };

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
            this.addAlert(`${row.data.data.identifier} deleted`, "warning");
          })
          .catch(err => {
            row.data.errors = err.response.data.errors;
          });
      } else this.gridOptions.rowData.splice(row.rowIndex, 1);

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
