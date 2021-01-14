<template>
  <b-form-select
    :autofocus="true"
    :select-size="selectSize"
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
      selectSizeMax: 5,
      selected: {
        id: "null",
        reverse: false
      }
    };
  },
  computed: {
    selectSize: function() {
      return this.params.values.length < this.selectSizeMax
        ? this.params.values.length
        : this.selectSizeMax;
    }
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
