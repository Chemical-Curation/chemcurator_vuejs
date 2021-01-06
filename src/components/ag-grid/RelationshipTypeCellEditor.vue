<template>
  <b-form-select
    style="height:100%; width:100%"
    v-model="selected"
    :options="params.values"
    @input="onClick()"
  />
</template>

<script>
import Vue from "vue";

export default Vue.extend({
  name: "RelationshipTypeCellRenderer",
  data() {
    return {
      selected: {
        id: "null",
        reverse: false
      }
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
    this.selected = {
      id: this.params.data.data.relationshipType.id,
      reverse: this.params.data.data.relationshipType.reverse
    };
  }
});
</script>
