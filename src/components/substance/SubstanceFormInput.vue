<template>
  <b-form-group
    :label="labels[field]"
    label-align="left"
    label-cols="3"
    :label-for="field"
    class="pb-3"
  >
    <template v-if="dropdowns.includes(field)">
      <SubstanceFormDropdown
        :field="field"
        :value="value"
        :state="validation.state"
        :payload="payload"
      />
    </template>
    <template v-else-if="textareas.includes(field)">
      <b-form-textarea
        :id="field"
        v-model="inputText"
        :state="validation.state"
        :disabled="!isAuthenticated"
      />
    </template>
    <template v-else>
      <b-form-input
        :id="field"
        v-model="inputText"
        :state="validation.state"
        :disabled="editable"
      />
    </template>
    <b-form-invalid-feedback>
      {{ validation.message }}
    </b-form-invalid-feedback>
  </b-form-group>
</template>

<script>
import { mapGetters } from "vuex";
import SubstanceFormDropdown from "@/components/substance/SubstanceFormDropdown";

export default {
  name: "SubstanceFormInput",
  components: {
    SubstanceFormDropdown
  },
  props: ["validation", "field", "value", "error", "payload"],
  data() {
    return {
      textareas: ["description", "privateQCNote", "publicQCNote"],
      dropdowns: ["qcLevel", "source", "substanceType"],
      labels: {
        id: "Substance ID:",
        preferredName: "Preferred Name:",
        casrn: "CAS-RN:",
        description: "Substance Description:",
        privateQCNote: "Private QC Notes:",
        publicQCNote: "Public QC Notes:",
        qcLevel: "QC Level:",
        source: "Source:",
        substanceType: "Substance Type:"
      }
    };
  },
  computed: {
    ...mapGetters("auth", ["isAuthenticated"]),

    editable: function() {
      return this.field === "id" ? true : !this.isAuthenticated;
    },
    inputText: {
      get() {
        return this.value
      },
      set(newValue) {
        if (!Object.keys(this.payload).includes("attributes")) {
          this.$set(this.payload, "attributes", {});
        }
        this.$set(this.payload.attributes, this.field, newValue);
      }
    }
  }
};
</script>

<style scoped></style>
