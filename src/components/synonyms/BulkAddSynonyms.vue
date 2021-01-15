<template>
  <div class="border rounded my-5 p-5">
    <h2>Add Synonyms</h2>

    <b-form @submit.prevent="onSubmit">
      <b-form-group label="Source">
        <b-form-select
          v-model="relationships.source"
          :options="sourceListOptions()"
          required
        ></b-form-select>
      </b-form-group>

      <b-form-group label="Quality">
        <b-form-select
          v-model="relationships.synonymQuality"
          :options="qualityListOptions()"
          required
        ></b-form-select>
      </b-form-group>

      <b-form-group label="Type">
        <b-form-select
          v-model="relationships.synonymType"
          :options="typeListOptions()"
        ></b-form-select>
      </b-form-group>

      <b-form-group label="Identifiers">
        <b-form-textarea
          v-model="attributes.identifiers"
          placeholder="Please provide list of identifiers..."
          required
        ></b-form-textarea>
      </b-form-group>

      <div v-show="errors.length > 0" class="mt-3 text-left">
        <error-table :errors="errors"></error-table>
      </div>

      <div class="d-flex flex-row-reverse">
        <b-button type="submit" variant="primary">Save</b-button>
      </div>
    </b-form>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import SynonymAPI from "@/api/synonym";
import ErrorTable from "@/components/ErrorTable";

export default {
  name: "BulkAddSynonyms",
  components: { ErrorTable },
  props: {
    substanceId: String
  },
  data() {
    return {
      relationships: {
        source: null,
        synonymQuality: null,
        synonymType: null
      },
      attributes: {
        identifiers: ""
      },
      errors: []
    };
  },
  methods: {
    onSubmit: function() {
      let identArr = this.attributes.identifiers
        .split("\n")
        .map(str => str.trim());
      this.errors = [];
      this.attributes.identifiers = "";

      for (let ident of identArr) {
        if (ident !== "") {
          SynonymAPI.post(this.buildRequestBody(ident)).catch(err =>
            this.onReject(err.response.data.errors, ident)
          );
        }
      }
    },
    onReject: function(errors, ident) {
      this.attributes.identifiers += `${ident}\n`;

      for (let error of errors) {
        if (!this.errors.find(element => element.code === error.code)) {
          this.errors.push(error);
        }
      }
    },

    buildRequestBody: function(identifier) {
      let body = {
        type: "synonym",
        attributes: {
          identifier: identifier
        },
        relationships: {}
      };

      if (this.substanceId)
        body.relationships = {
          substance: {
            data: {
              id: this.substanceId,
              type: "substance"
            }
          }
        };

      for (let relationship in this.relationships) {
        if (this.relationships[relationship]) {
          body.relationships[relationship] = {};
          body.relationships[relationship]["data"] = {
            id: this.relationships[relationship],
            type: relationship
          };
        }
      }

      return body;
    }
  },
  computed: {
    ...mapGetters("synonymQuality", { qualityListOptions: "getOptions" }),
    ...mapGetters("source", { sourceListOptions: "getOptions" }),
    ...mapGetters("synonymType", { typeListOptions: "getOptions" })
  }
};
</script>
