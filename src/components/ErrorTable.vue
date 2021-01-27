<template>
  <b-table
    :id="id"
    :items="modifiedErrors"
    :fields="[{ label: 'Errors', key: 'modifiedDetail' }]"
    borderless
    table-variant="danger"
  ></b-table>
</template>

<script>
import _ from "lodash";

export default {
  name: "ErrorTable",
  props: {
    id: String,
    errors: Array
  },
  computed: {
    modifiedErrors: function() {
      return _.cloneDeep(this.errors).map(error => {
        error.modifiedDetail = this.buildErrorString(error);
        return error;
      });
    }
  },
  methods: {
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
    }
  }
};
</script>

<style scoped></style>
