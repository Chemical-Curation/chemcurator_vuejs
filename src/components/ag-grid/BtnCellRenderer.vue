
<template>
  <span>
    <b-button size="sm" variant="success" @click="btnClickedHandler()">
      Save
    </b-button>
  </span>
</template>

<script>
  import Vue from "vue";

  // Built using https://blog.ag-grid.com/cell-renderers-in-ag-grid-every-different-flavour/ as a guide

  export default Vue.extend({
    name: "BtnCellRenderer",
    methods: {
      btnClickedHandler() {
        this.params.clicked(this.params.data);
      }
    }
  });
</script>


