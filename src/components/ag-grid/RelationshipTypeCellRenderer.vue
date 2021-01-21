<template>
  <span>
    {{ label }}
  </span>
</template>

<script>
import Vue from "vue";

export default Vue.extend({
  name: "RelationshipTypeCellRenderer",
  computed: {
    label: function() {
      let obj = this.params.map[this.params.data.data.relationshipType.id];
      if (obj)
        return this.params.data.data.relationshipType.reverse
          ? obj.attributes.corrolaryLabel
          : obj.attributes.label;
      return "";
    }
  }
});
</script>
