<template>
  <span>
    {{ label }}
  </span>
</template>

<script>
import Vue from "vue";

// Built using https://blog.ag-grid.com/cell-renderers-in-ag-grid-every-different-flavour/ as a guide

export default Vue.extend({
  name: "RelationshipTypeCellRenderer",
  computed: {
    label: function() {
      let obj = this.params.map[this.params.data.data.relationshipType.id];
      return this.params.data.data.relationshipType.reverse
        ? obj.attributes.corrolaryLabel
        : obj.attributes.label;
    }
  }
});
</script>
