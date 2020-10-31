<template>
  <b-form class="pb-3">
    <div v-for="(formKey, index) in Object.keys(getForm)" :key="index">
      <SubstanceFormInput
        :val="formKey"
        :form="getForm"
        :store="formKey.split('ID').shift()"
      />
    </div>
    <b-button @click="saveSubstance(type)" variant="primary" v-if="editable"
      >Save Substance</b-button
    >
  </b-form>
</template>

<script>
import SubstanceFormInput from "@/components/substance/SubstanceFormInput";
import { mapGetters } from "vuex";

export default {
  name: "SubstanceForm",
  components: {
    SubstanceFormInput
  },
  props: {
    // Type compound being displayed.  Important for knowing which store to fetch from.
    type: String
  },
  computed: {
    ...mapGetters("substance", ["getForm"]),
    editable: function() {
      return true;
    }
  },
  methods: {
    saveSubstance() {
      console.log("poop");
    }
  }
};
</script>

<style scoped></style>
