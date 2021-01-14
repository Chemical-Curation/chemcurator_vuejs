<template>
  <span>
    {{ text }}
  </span>
</template>

<script>
import Vue from "vue";

export default Vue.extend({
  name: "MappableCellRenderer",
  computed: {
    text: function() {
      return this.params.map?.[this.params.value]?.attributes?.label;
    }
  }
});
</script>
