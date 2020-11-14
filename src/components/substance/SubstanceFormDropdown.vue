<template>
  <b-form-select
    :id="field"
    v-model="inputText"
    :state="state"
    :options="buildOptions(dropdownList)"
    :disabled="!isAuthenticated"
  />
</template>

<script>
import { mapGetters, mapState } from "vuex";

export default {
  name: "SubstanceFormDropdown",
  props: ["field", "state", "payload"],
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
        // for some reason these values get set on formLoad
        // so only when the user changes them in the dropdown
        // should this be updated
        if (this.inputText !== newValue ) {
          if (!Object.keys(this.payload).includes("relationships")) {
            this.$set(this.payload, "relationships", {})
          }
          let obj = {data: {type: this.field, id: newValue}}
          this.$set(this.payload.relationships, this.field, obj);
        }
      }
    }
  },
  methods: {
    buildOptions: function(list) {
      return list.map(item => {
        return {
          value: item.id,
          text: item.attributes.label
        }
      });
    }
  }
};
</script>

<style scoped></style>
