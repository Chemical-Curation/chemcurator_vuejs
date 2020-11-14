<template >
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
        :state="validation.state"
        :payload="payload" />
    </template>
    <template v-else-if="textareas.includes(field)">
      <b-form-textarea :id="field" :state="validation.state" v-model="inputText" :disabled="!isAuthenticated" />
    </template>
    <template v-else>
      <b-form-input :id="field" :state="validation.state" v-model="inputText" :disabled="authAbility" />
    </template>
    <b-form-invalid-feedback >
      {{ validation.message }}
    </b-form-invalid-feedback>
  </b-form-group>
</template>

<script>
import { mapState, mapGetters} from "vuex"; // , mapState
import SubstanceFormDropdown from "@/components/substance/SubstanceFormDropdown";

export default {
  name: "SubstanceFormInput",
  components: {
    SubstanceFormDropdown
  },
  props: ["validation", "field","error","payload"],
  data() {
    return {
      textareas: ["privateQCNotes", "publicQCNotes"],
      dropdowns: ["qcLevel", "source", "substanceType"],
      labels: {
        sid: "Substance ID:",
        preferredName: "Preferred Name:",
        casrn: "CAS-RN:",
        substanceDescription: "Substance Description:",
        privateQCNotes: "Private QC Notes:",
        publicQCNotes: "Public QC Notes:",
        qcLevel: "QC Level:",
        source: "Source:",
        substanceType: "Substance Type:"
      }
    };
  },
  computed: {
    ...mapGetters("auth", ["isAuthenticated"]),
    ...mapGetters("substance", ["getValid"]),
    ...mapState("substance", ["errors"]),

    authAbility: function() {
      return (this.field === "sid") ? true : !this.isAuthenticated;
    },
    inputText: {
      get() {
        return this.$store.state.substance.form[this.field];
      },
      set(newValue) {
        if (!Object.keys(this.payload).includes("attributes")) {
          this.$set(this.payload, "attributes", {})
        }
        this.$set(this.payload.attributes, this.field, newValue);
      }
    }
  }
};
</script>

<style scoped></style>
