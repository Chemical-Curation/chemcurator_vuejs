<template>
  <b-button
    size="sm"
    :variant="params.buttonVariant"
    :disabled="!isEnabled"
    @click="btnClickedHandler()"
  >
    {{ params.buttonText }}
  </b-button>
</template>

<script>
import Vue from "vue";

// Built using https://blog.ag-grid.com/cell-renderers-in-ag-grid-every-different-flavour/ as a guide

export default Vue.extend({
  name: "BtnCellRenderer",
  data() {
    return {
      isEnabled: false
    };
  },
  watch: {
    "params.data": {
      deep: true,
      immediate: true,
      handler: "enabled"
    }
  },
  methods: {
    btnClickedHandler() {
      this.params.clicked(this.params);
    },
    enabled() {
      this.isEnabled = this.params.enabled(this.params.data);
    }
  }
});
</script>
