<template>
  <b-form-select
    :id="field"
    v-model="inputText"
    :state="state"
    :options="options"
    :disabled="!isAuthenticated"
  />
</template>

<script>
import { mapGetters, mapState } from "vuex";

export default {
  name: "SubstanceFormDropdown",
  props: ["field", "value", "state", "payload"],
  computed: {
    ...mapGetters("auth", ["isAuthenticated"]),
    ...mapState({
      options (state, getters) {
        // get the options from the appropriate store module
        return getters[`${this.field}/getOptions`]
      }
    }),

    inputText: {
      get() {
        return this.value;
      },
      set(newValue) {
        // for some reason these values get set on formLoad
        // so only when the user changes them in the dropdown
        // should this be updated, hence the comparison with the form value
        if (this.inputText !== newValue) {
          if (!Object.keys(this.payload).includes("relationships")) {
            this.$set(this.payload, "relationships", {});
          }
          let obj = { data: { type: this.field, id: newValue } };
          this.$set(this.payload.relationships, this.field, obj);
        }
      }
    }
  }
};
</script>

<style scoped></style>
