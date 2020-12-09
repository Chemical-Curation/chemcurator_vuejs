<template>
  <span>
    <b-button size="sm" variant="primary" :disabled="!hasChanged" @click="btnClickedHandler()">
      Save
    </b-button>
  </span>
</template>

<script>
  import Vue from "vue";
  import _ from "lodash";

  // Built using https://blog.ag-grid.com/cell-renderers-in-ag-grid-every-different-flavour/ as a guide

  export default Vue.extend({
    name: "BtnCellRenderer",
    computed: {
      hasChanged: function() {
        return !_.isEqual(this.params.data.data, this.params.data.initialData)
      },
    },
    methods: {
      btnClickedHandler() {
        this.params.clicked(this.params.data);
      }
    }
  });
</script>


