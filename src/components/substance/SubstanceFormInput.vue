<template >
  <b-form-group
    :label="labels[val]"
    label-align="left"
    label-cols="3"
    :label-for="val"
    class="pb-3"
  >
    <template v-if="dropdowns.includes(val)">
      <SubstanceFormDropdown :val="val" />
    </template>
    <template v-else-if="textareas.includes(val)">
      <b-form-textarea :id="val" v-model="value" :disabled="!isAuthenticated" />
    </template>
    <template v-else>
      <b-form-input :id="val" v-model="value" :disabled="authAbility" />
    </template>
  </b-form-group>
</template>

<script>
import { mapGetters} from "vuex"; // , mapState 
import SubstanceFormDropdown from "@/components/substance/SubstanceFormDropdown";

export default {
  name: "SubstanceFormInput",
  components: {
    SubstanceFormDropdown
  },
  props: ["val", "form"],
  data() {
    return {
      textareas: ["privateQCNotes", "publicQCNotes"],
      dropdowns: ["qcLevelID", "sourceID", "substanceTypeID"],
      labels: {
        sid: "Substance ID:",
        preferredName: "Preferred Name:",
        casrn: "CAS-RN:",
        substanceDescription: "Substance Description:",
        privateQCNotes: "Private QC Notes:",
        publicQCNotes: "Public QC Notes:",
        qcLevelID: "QC Level:",
        sourceID: "Source:",
        substanceTypeID: "Substance Type:"
      }
    };
  },
  computed: {
    ...mapGetters("auth", ["isAuthenticated"]),

    authAbility: function() {
      if (this.val === "sid") {
        return true;
      } else {
        return !this.isAuthenticated;
      }
    },
    value: {
      get() {
        return this.form[this.val];
      },
      set(newValue) {
        this.$store.commit("substance/updatePayload", { key: this.val, value: newValue });
      }
    }
  }
};
</script>

<style scoped></style>
