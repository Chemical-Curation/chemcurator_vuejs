<template>
  <b-form-group
    :label="label"
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
    <b-form-invalid-feedback :id="'feedback-' + field">
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
  props: ["validation", "field", "value", "payload", "label"],
  data() {
    return {
      textareas: ["description", "privateQCNote", "publicQCNote"],
      dropdowns: ["qcLevel", "source", "substanceType"]
    };
  },
  computed: {
    ...mapGetters("auth", ["isAuthenticated"]),

    editable: function() {
      return this.field === "id" ? true : !this.isAuthenticated;
    },
    inputText: {
      get() {
        return this.value;
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
