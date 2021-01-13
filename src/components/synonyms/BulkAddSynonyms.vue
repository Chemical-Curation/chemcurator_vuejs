<template>
  <div class="border rounded my-5 p-5">
    <h2>Add Synonyms</h2>

    <b-form @submit.prevent="onSubmit">
      <b-form-group label="Source">
        <b-form-select v-model="relationships.source" :options="sourceListOptions()" required></b-form-select>
      </b-form-group>

      <b-form-group label="Quality">
        <b-form-select v-model="relationships.synonymQuality" :options="qualityListOptions()" required></b-form-select>
      </b-form-group>

      <b-form-group label="Type">
        <b-form-select v-model="relationships.synonymType" :options="typeListOptions()"></b-form-select>
      </b-form-group>

      <b-form-group label="Identifiers">
        <b-form-textarea v-model="attributes.identifiers" placeholder="Please provide list of identifiers..." required></b-form-textarea>
      </b-form-group>

      <div v-show="Object.keys(errors).length > 0" class="mt-3 text-left">
        <b-table
          id="synonym-error-table"
          :items="errors"
          :fields="[{ 'label': 'Errors', 'key': 'modifiedDetail' }]"
          borderless
          table-variant="danger"
        ></b-table>
      </div>

      <div class="d-flex flex-row-reverse">
        <b-button type="submit" variant="primary">Save</b-button>
      </div>

    </b-form>

  </div>
</template>

<script>
import {mapGetters} from "vuex";
import SynonymAPI from "@/api/synonym"

export default {
  name: "BulkAddSynonyms",
  props: {
    substanceId: String
  },
  data() {
    return {
      relationships: {
        source: null,
        synonymQuality: null,
        synonymType: null,
      },
      attributes: {
        identifiers: "",
      },
      errors: []
    }
  },
  methods: {
    onSubmit: function(){
      let identArr = this.attributes.identifiers.split("\n").map(str=>str.trim())
      this.errors = []
      this.attributes.identifiers = ""

      for (let ident of identArr) {
        if (ident !== ""){
          SynonymAPI.post(this.buildRequestBody(ident))
            .catch((err) => this.onReject(err.response.data.errors, ident))
        }
      }
    },
    onReject: function(errors, ident) {
      this.attributes.identifiers += `${ident}\n`

      for (let error of errors) {
        if (!this.errors.find(element => element.code === error.code)) {
          error.modifiedDetail = this.buildErrorString(error)
          this.errors.push(error)
        }
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

    buildRequestBody: function(identifier){
       let body = {
        type: "synonym",
        attributes: {
          identifier: identifier
        },
        relationships: {}
      }

      if (this.substanceId)
        body.relationships = {
          substance: {
            data: {
              id: this.substanceId,
              type: "substance"
            }
          }
        }

      for (let relationship in this.relationships){
        if (this.relationships[relationship]) {
          body.relationships[relationship] = {}
          body.relationships[relationship]["data"] = { id: this.relationships[relationship], type: relationship }
        }
      }

      return body
    }
  },
  computed: {
    ...mapGetters("synonymQuality", { qualityListOptions: "getOptions" }),
    ...mapGetters("source", { sourceListOptions: "getOptions" }),
    ...mapGetters("synonymType", { typeListOptions: "getOptions" }),
  }
};
</script>
