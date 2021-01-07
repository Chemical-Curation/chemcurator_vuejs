<template>
  <b-form-select
    v-model="selected"
    :options="params.values"
    @input="onClick()"
  />
</template>

<script>
import Vue from "vue";

export default Vue.extend({
  name: "SelectObjectCellRenderer",
  data() {
    return {
      selected: null
    };
  },
  methods: {
    getValue() {
      return this.selected;
    },

    isPopup() {
      return true;
    },

    onClick() {
      this.params.api.stopEditing();
    }
  },
  created() {
    this.selected = this.params.value;
  }
});
</script>
