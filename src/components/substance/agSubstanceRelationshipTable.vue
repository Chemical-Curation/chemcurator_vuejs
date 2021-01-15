<template>
  <div>
    <div class="text-left">
      <h3>Substance Relationships</h3>
    </div>
    <ag-grid-vue
      id="substance-relationship-table"
      style="height: 250px"
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
      <error-table :errors="selectedError" id="relationship-error-table"></error-table>
    </div>
    <div class="d-flex flex-row justify-content-end my-3" v-if="editable">
      <b-button
        id="relationship-add-button"
        class="ml-1"
        variant="success"
        :disabled="!substanceId || loading"
        @click="addRelationship"
      >
        Add Relationship
      </b-button>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";
import { AgGridVue } from "ag-grid-vue";
import { agGridMixin } from "@/components/ag-grid/agGridMixin";
import SubstanceRelationshipApi from "@/api/substance-relationships";
import ErrorTable from "@/components/ErrorTable";

export default {
  name: "agSubstanceRelationshipTable",
  components: {
    AgGridVue,
    ErrorTable
  },
  mixins: [agGridMixin],
  props: {
    // Substance ID to which these synonyms will be related
    substanceId: String,
    editable: Boolean
  },
  computed: {
    ...mapGetters("source", { sourceListOptions: "getOptions" }),
    ...mapGetters("relationshipType", { typeListOptions: "getOptions" }),
    ...mapState("source", { sourceList: "list" }),
    ...mapState("relationshipType", { relationshipTypeList: "list" }),

    /**
     * Defines the columns to be used in ag grid table
     */
    columnDefs: function() {
      let colDefs = [
        {
          headerName: "Type",
          field: "data.relationshipType",
          comparator: this.typeMapCompare,
          cellRenderer: "relationshipTypeCellRenderer",
          cellRendererParams: {
            map: this.typeListMap
          },
          cellEditor: "relationshipTypeCellEditor",
          cellEditorParams: {
            values: this.typeListOptions(
              "relationships.relationshipType.data.id"
            )
          }
        },
        {
          headerName: "SID",
          // Strips the checksum from the comparison
          comparator: this.sidCompare,
          field: "data.relatedSubstanceId"
        },
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
     * Loads the substance relationships for the currently loaded substance
     */
    substanceId: function() {
      this.loadSubstanceRelationships(this.substanceId);
    }
  },
  methods: {
    ...mapActions("relationshipType", { loadRelationshipTypeList: "getList" }),
    ...mapActions("source", { loadSourceList: "getList" }),

    /**
     * Loads substance relationships by substance id.
     */
    loadSubstanceRelationships: async function(substanceId) {
      this.loading = true;

      let substanceRelationships = [];
      if (substanceId)
        substanceRelationships = await SubstanceRelationshipApi.list({
          params: [{ key: "filter[substance.id]", value: substanceId }]
        }).then(res => {
          return res.data.data;
        });

      this.rowData = this.buildRowData(substanceRelationships);
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
        type: "substanceRelationship",
        attributes: {
          qcNotes: data.qcNotes
        },
        relationships: {
          fromSubstance: {
            data: {
              id: data.relationshipType?.reverse
                ? data.relatedSubstanceId
                : this.substanceId,
              type: "substance"
            }
          },
          toSubstance: {
            data: {
              id: data.relationshipType?.reverse
                ? this.substanceId
                : data.relatedSubstanceId,
              type: "substance"
            }
          },
          source: {
            data: {
              id: data.source,
              type: "source"
            }
          },
          relationshipType: {
            data: {
              id: data.relationshipType?.id,
              type: "relationshipType"
            }
          }
        }
      };
      return requestBody;
    },

    /**
     * Rebuilds rowData with a provided array of jsonapi compliant synonyms
     *
     * @param substanceRelationship {Object} - JsonAPI formatted synonym or null
     *     Sample JsonAPI substanceRelationship
     *     {
     *       id: "substanceRelationship"
     *       attributes: { qcNotes: "string" },
     *       relationships: {
     *         toSubstance: {
     *           data: { type: "substance", id: "string" }
     *         },
     *         fromSubstance: {
     *           data: { type: "substance", id: "string" }
     *         },
     *         source: {
     *           data: { type: "source", id: "string" }
     *         },
     *         relationshipType: {
     *           data: { type: "relationshipType", id: "string" }
     *         },
     *       }
     *     }
     * @returns {Object} - agGrid rowData node.
     *     Sample rowData node
     *     {
     *       id: "string",  The synonym's id or null
     *       data: { qcNotes, relatedSubstanceId, relationshipType, source }, The rendered field data
     *       initialData: The initial field data
     *       errors: {detail, status, source: { pointer: "string"}, code },  Any save errors as error objects
     *       created: True if this is a new, unsaved row
     *     }
     */
    toRowData: function(substanceRelationship) {
      let relatedSubstanceId = this.sidGetter(substanceRelationship);
      let data = {
        relatedSubstanceId: relatedSubstanceId,
        qcNotes: substanceRelationship?.attributes?.qcNotes ?? "",
        relationshipType: {
          id:
            substanceRelationship?.relationships?.relationshipType?.data?.id ??
            null,
          reverse:
            substanceRelationship?.relationships?.fromSubstance?.data?.id ===
            relatedSubstanceId
        },
        source: substanceRelationship?.relationships?.source?.data?.id ?? null
      };

      return {
        id: substanceRelationship?.id ?? null,
        data: { ...data },
        initialData: { ...data },
        errors: null,
        created: !substanceRelationship?.id // if there is no id, this row is considered "new".
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
        ? SubstanceRelationshipApi.post(requestBody)
            .then(onSuccess)
            .catch(onFailure)
        : SubstanceRelationshipApi.patch({
            id: row.id,
            body: { ...requestBody, id: row.id }
          })
            .then(onSuccess)
            .catch(onFailure);
    },

    /**
     * Adds a new synonym to this.rowData
     */
    addRelationship: function() {
      if (!this.substanceId) {
        this.addAlert("Please load a substance", "warning");
        return;
      }
      this.rowData.unshift(this.toRowData(null));
    },

    /**
     * Deletes a single row - not implemented yet
     *
     * @param row {obj} - rowData object
     * @returns {Promise} - Deletes a row
     */
    // deleteRow: function(row) {
    //   if (!row.data.created) {
    //     SubstanceRelationshipApi.delete(row.data.id)
    //       .then(() => {
    //         this.gridOptions.rowData.splice(row.rowIndex, 1);
    //       })
    //       .catch(err => {
    //         row.data.errors = err.response.data.errors;
    //       });
    //   } else this.gridOptions.rowData.splice(row.rowIndex, 1);
    //
    //   this.gridOptions.api.redrawRows();
    // },

    /**
     * Returns a boolean comparing two objects
     *
     * @param substanceRelationship - JsonApi formatted substance relationship
     * @returns {string} - SID of the substance that is not currently loaded,
     *    or the current SID if this relationship is self-referential.
     */
    sidGetter: function(substanceRelationship) {
      let fromSID =
        substanceRelationship?.relationships?.fromSubstance?.data?.id;
      let toSID = substanceRelationship?.relationships?.toSubstance?.data?.id;

      if (fromSID === this.substanceId) {
        return toSID;
      } else {
        return fromSID;
      }
    },

    /**
     * Returns an int comparing two objects
     *
     * @param valueA - The id of object 1
     * @param valueB - The id of object 2
     * @returns {int} - 1 if object 1's label is first alphabetically otherwise -1
     */
    sidCompare: function(valueA, valueB) {
      let comparison = valueA.substring(8) > valueB.substring(8);
      return comparison ? 1 : -1;
    },

    /**
     * Returns an int comparing the map.attribute.labels for two objects
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
     * Returns an int comparing the map.attribute.labels for two objects
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
    this.loadSubstanceRelationships(this.substanceId);
    if (this.gridOptions.api)
      this.gridOptions.api.refreshCells({
        force: true,
        suppressFlash: false
      });

    // set the overlay based on the mounted state
    this.manageOverlay();

    // Load related info
    this.loadRelationshipTypeList();
    // sources are loaded on the substance page.
    // This is redundant but will be required if reuse this component.
    // this.loadSourceList();
  }
};
</script>

<style scoped></style>
