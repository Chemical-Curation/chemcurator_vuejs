<template>
  <b-form-select
    :id="val"
    v-model="value"
    :options="options"
    :disabled="!isAuthenticated"
  />
</template>

<script>
import { mapGetters, mapState } from "vuex";

export default {
  name: "SubstanceFormDropdown",
  props: ["val"],
  computed: {
    ...mapGetters("auth", ["isAuthenticated"]),
    ...mapState({
      dropdownList(state) {
        // get the list from the appropriate store module
        return state[this.val.split("ID").shift()].list;
      }
    }),

    value: {
      get() {
        return this.$store.state.substance.form[this.val];
      },
      set(value) {
        if (this.value !== value) {
          this.$store.commit("substance/updatePayload", { key: this.val, value: value });
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
