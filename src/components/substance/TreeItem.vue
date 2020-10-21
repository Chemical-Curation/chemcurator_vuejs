<template>
  <li>
    <div
      :id="!isFolder ? item.name : false"
      :class="{ bold: isFolder }"
      @click="toggle(item.id)"
    >
      <b-icon :icon="item.icon" />
      {{ item.name }}
      <span v-if="isFolder">
        [{{ isOpen ? "-" : "+" }}]
      </span>
    </div>
    <ul v-show="isOpen" v-if="isFolder">
      <TreeItem
        class="item"
        v-for="child in item.children"
        :key="child.id"
        :item="child"
      />
    </ul>
  </li>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "TreeItem",
  props: {
    item: Object
  },
  data: function() {
    return {
      isOpen: false
    };
  },
  computed: {
    isFolder: function() {
      return this.item.children && this.item.children.length;
    }
  },
  methods: {
    ...mapActions({ loadForm: "substance/loadForm" }),
    toggle: function(val) {
      if (this.isFolder) {
        this.isOpen = !this.isOpen;
      } else {
        this.$root.$emit("bv::toggle::collapse", "substance-sidebar");
        this.loadForm(val);
      }
    }
  }
};
</script>
<style scoped>
.item {
  cursor: pointer;
}
.bold {
  font-weight: bold;
}
ul {
  list-style: none;
}
</style>
