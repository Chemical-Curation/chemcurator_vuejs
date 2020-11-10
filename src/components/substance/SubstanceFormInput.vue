<template >
  <b-form-group
    :label="labels[field]"
    label-align="left"
    label-cols="3"
    :label-for="field"
    class="pb-3"
  >
    <template v-if="dropdowns.includes(field)">
      <SubstanceFormDropdown :field="field" :formState="getValid(field)"/>
    </template>
    <template v-else-if="textareas.includes(field)">
      <b-form-textarea :id="field" :state="getValid(field)" v-model="inputText" :disabled="!isAuthenticated" />
    </template>
    <template v-else>
      <b-form-input :id="field" :state="getValid(field)" v-model="inputText" :disabled="authAbility" />
    </template>
    <b-form-invalid-feedback >
      {{ errors[field] }}
    </b-form-invalid-feedback>
  </b-form-group>
</template>

<script>
import { mapState , mapGetters} from "vuex"; // , mapState 
import SubstanceFormDropdown from "@/components/substance/SubstanceFormDropdown";

export default {
  name: "SubstanceFormInput",
  components: {
    SubstanceFormDropdown
  },
  props: ["field"],
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
    ...mapState("substance", ["fieldidated", "errors"]),

    authAbility: function() {
      if (this.field === "sid") {
        return true;
      } else {
        return !this.isAuthenticated;
      }
    },
    inputText: {
      get() {
        return this.$store.state.substance.form[this.field];
      },
      set(newValue) {
        this.$store.commit("substance/updatePayload", { field: this.field, inputText: newValue });
      }
    }
  }
};
</script>

<style scoped></style>
