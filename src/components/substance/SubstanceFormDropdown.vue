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
  props: ["field", "state", "pld"],
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
        if (!Object.keys(this.pld).includes("relationships")) {
          this.$set(this.pld, "relationships", {})
        }
        let obj = {data: {type: this.field, id: newValue}}
        this.$set(this.pld.relationships, this.field, obj);
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
