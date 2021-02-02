<template>
  <div>
    <b-alert
      :variant="alert.style"
      :show="alert.timer"
      @dismiss-count-down="countDownChanged"
      >{{ alert.message }}</b-alert
    >
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
          required
        ></b-form-select>
      </b-form-group>

      <b-form-group label="Identifiers">
        <b-form-textarea
          v-model="attributes.identifiers"
          placeholder="Please provide list of identifiers..."
          :state="errors.length === 0 ? null : false"
        ></b-form-textarea>
      </b-form-group>

      <div v-show="errors.length > 0" class="mt-3 text-left">
        <error-table :errors="errors"></error-table>
      </div>

      <div class="d-flex flex-row-reverse">
        <b-button type="submit" variant="primary" :disabled="!savable"
          >Save</b-button
        >
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
      errors: [],
      alert: {
        style: "success",
        message: "",
        timer: 0
      },
      maxTimer: 10
    };
  },
  methods: {
    countDownChanged: function(countdown) {
      this.alert.timer = countdown;
    },

    onSubmit: async function() {
      let identArr = this.attributes.identifiers
        .split("\n")
        .map(str => str.trim());
      this.errors = [];
      this.attributes.identifiers = "";

      let promises = [];
      for (let ident of identArr) {
        if (ident !== "") {
          promises.push(
            SynonymAPI.post(this.buildRequestBody(ident))
              .then()
              .catch(err => this.onReject(err.response.data.errors, ident))
          );
        }
      }
      await Promise.allSettled(promises);

      if (this.errors.length === 0 && promises.length !== 0)
        // Only warn if at least one identifier attempted to save.
        this.alert = {
          style: "success",
          message: "All Identifiers Saved",
          timer: this.maxTimer
        };
      else if (promises.length !== 0)
        this.alert = {
          style: "warning",
          message:
            "The below identifiers were not saved. Review the errors and reattempt.",
          timer: this.maxTimer
        };

      this.$emit("save");
    },
    onReject: function(errors, ident) {
      this.attributes.identifiers += `${ident}\n`;

      for (let error of errors) {
        if (
          !this.errors.find(element => element.code === error.code) ||
          error.code === "invalid"
        ) {
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
    ...mapGetters("synonymType", { typeListOptions: "getOptions" }),

    /**
     * Returns whether the form data is considered savable
     *
     * Savable if there are identifiers and none of the relationships are null
     *
     * @return {boolean} True if savable, False if not savable (missing required field).
     */
    savable: function() {
      return (
        this.attributes.identifiers !== "" &&
        Object.entries(this.relationships).filter(entry => {
          return entry[1] === null; // return true if the current relationship value is null
        }).length === 0
      );
    }
  }
};
</script>
