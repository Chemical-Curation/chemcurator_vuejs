<template id="my-form">
  <b-form-group
    :label="labels[val]"
    label-align="left"
    label-cols="3"
    :label-for="val"
    class="pb-3"
  >
    <template v-if="dropdowns.includes(val)">
      <b-form-select
        :id="val"
        v-model="value"
        :options="options"
        :disabled="!isAuthenticated"
      />
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
import { mapGetters, mapState } from "vuex";

export default {
  name: "SubstanceFormInput",
  props: ["val", "form", "store"],
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
    ...mapGetters("substance", ["getForm"]),
    ...mapState({
      dropdownList(state) {
        // get the list from the appropriate store module
        return state[this.val.split("ID").shift()].list;
      }
    }),

    authAbility: function() {
      if (this.val === "sid") {
        return true;
      } else {
        return !this.isAuthenticated;
      }
    },
    value: {
      get() {
        return this.getForm[this.val];
      },
      set(newValue) {
        this.$store.commit("substance/saveData", { [this.val]: newValue });
      }
    },
    options: function() {
      return this.buildOptions(this.dropdownList);
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
    this.$store.dispatch("qcLevel/getList");
    this.$store.dispatch("substanceType/getList");
  }
};
</script>

<style scoped></style>
