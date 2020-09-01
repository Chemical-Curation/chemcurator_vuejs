<template>
  <b-form class="pb-3">
    <b-form-group
      label="Substance ID:"
      label-align="left"
      label-cols="3"
      label-for="substanceID"
      class="pb-3"
    >
      <b-form-input id="substanceID" v-model="form.sid" disabled></b-form-input>
    </b-form-group>
    <b-form-group
      label="Preferred Name:"
      label-align="left"
      label-cols="3"
      label-for="preferredName"
      class="pb-3"
    >
      <b-form-input
        id="preferredName"
        v-model="form.preferredName"
        :disabled="!isAuthenticated"
      ></b-form-input>
    </b-form-group>
    <b-form-group
      label="CAS-RN:"
      label-align="left"
      label-cols="3"
      label-for="casrn"
      class="pb-3"
    >
      <b-form-input
        id="casrn"
        v-model="form.casrn"
        :disabled="!isAuthenticated"
      ></b-form-input>
    </b-form-group>
    <b-form-group
      label="QC Level:"
      label-align="left"
      label-cols="3"
      label-for="qcLevel"
      class="pb-3"
    >
      <b-form-select
        id="qcLevel"
        v-model="form.qcLevelID"
        :options="qcLevelsOptions"
        :disabled="!isAuthenticated"
      ></b-form-select>
    </b-form-group>
    <b-form-group
      label="Source:"
      label-align="left"
      label-cols="3"
      label-for="source"
      class="pb-3"
    >
      <b-form-select
        id="source"
        v-model="form.sourceID"
        :options="sourceOptions"
        :disabled="!isAuthenticated"
      ></b-form-select>
    </b-form-group>
    <b-form-group
      label="Substance Type:"
      label-align="left"
      label-cols="3"
      label-for="substanceType"
      class="pb-3"
    >
      <b-form-select
        id="substanceType"
        v-model="form.substanceTypeID"
        :options="substanceTypeOptions"
        :disabled="!isAuthenticated"
      ></b-form-select>
    </b-form-group>
    <b-form-group
      label="Substance Description:"
      label-align="left"
      label-cols="3"
      label-for="substanceDescription"
      class="pb-3"
    >
      <b-form-textarea
        id="substanceDescription"
        v-model="form.substanceDescription"
        :disabled="!isAuthenticated"
      ></b-form-textarea>
    </b-form-group>
    <b-form-group
      label="Private QC Notes:"
      label-align="left"
      label-cols="3"
      label-for="privateQCNotes"
      class="pb-3"
    >
      <b-form-textarea
        id="privateQCNotes"
        v-model="form.privateQCNotes"
        :disabled="!isAuthenticated"
      ></b-form-textarea>
    </b-form-group>
    <b-form-group
      label="Public QC Notes:"
      label-align="left"
      label-cols="3"
      label-for="publicQCNotes"
      class="pb-3"
    >
      <b-form-textarea
        id="publicQCNotes"
        v-model="form.publicQCNotes"
        :disabled="!isAuthenticated"
      ></b-form-textarea>
    </b-form-group>
  </b-form>
</template>

<script>
import { mapGetters, mapState } from "vuex";

export default {
  name: "SubstanceForm",
  props: {
    // Type compound being displayed.  Important for knowing which store to fetch from.
    type: String
  },
  computed: {
    ...mapGetters("auth", ["isAuthenticated"]),

    ...mapGetters("compound/definedcompound", {
      getDefSubstanceForm: "getSubstanceForm"
    }),
    ...mapGetters("compound/illdefinedcompound", {
      getIndefSubstanceForm: "getSubstanceForm"
    }),

    ...mapState("source", { sourceList: "list" }),
    ...mapState("substanceType", { substanceTypeList: "list" }),
    ...mapState("qcLevel", { qcLevelList: "list" }),

    form: function() {
      return this.type === "definedCompound"
        ? this.getDefSubstanceForm
        : this.getIndefSubstanceForm;
    },
    sourceOptions: function() {
      return this.buildOptions(this.sourceList);
    },
    substanceTypeOptions: function() {
      return this.buildOptions(this.substanceTypeList);
    },
    qcLevelsOptions: function() {
      return this.buildOptions(this.qcLevelList);
    }
  },
  methods: {
    buildOptions: function(list) {
      let item;
      let options = [];
      for (item of list)
        options.push({ value: item.id, text: item.attributes.label });
      return options;
    }
  },
  mounted() {
    this.$store.dispatch("source/getList");
    this.$store.dispatch("substanceType/getList");
    this.$store.dispatch("qcLevel/getList");
  }
};
</script>

<style scoped></style>
