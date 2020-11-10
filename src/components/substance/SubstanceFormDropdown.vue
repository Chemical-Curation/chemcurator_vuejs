<template>
  <b-form-select
    :id="field"
    v-model="inputText"
    :state="formState"
    :options="options"
    :disabled="!isAuthenticated"
  />
</template>

<script>
import { mapGetters, mapState } from "vuex";

export default {
  name: "SubstanceFormDropdown",
  props: ["field", "formState"],
  computed: {
    ...mapGetters("auth", ["isAuthenticated"]),
    ...mapState({
      dropdownList(state) {
        // get the list from the appropriate store module
        return state[this.field].list;
      }
    }),

    inputText: {
      get() {
        return this.$store.state.substance.form[this.field];
      },
      set(newValue) {
        if (this.inputText !== newValue) {
          this.$store.commit("substance/updatePayload", { field: this.field, inputText: newValue });
        }
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
  }
};
</script>

<style scoped></style>
