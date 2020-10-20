<template>
  <li>
    <div :id="id" :class="{ bold: isFolder }" @click="toggle(item.name)">
      <b-icon :icon="item.icon"></b-icon>
      {{ item.name }}
      <span v-if="isFolder">[{{ isOpen ? "-" : "+" }}]</span>
    </div>
    <ul v-show="isOpen" v-if="isFolder">
      <TreeItem
        class="item"
        v-for="child in item.children"
        :key="child.id"
        :item="child"
      ></TreeItem>
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
    },
    id: function() {
      if (!this.isFolder) {return this.item.name}
      else {return ""}
    }
  },
  methods: {
    ...mapActions({ loadForm: "substance/loadForm" }),
    toggle: function(val) {
      if (this.isFolder) {
        this.isOpen = !this.isOpen;
      } else {
        this.$root.$emit("bv::toggle::collapse", "substance-sidebar");
        let obj;
        this.$store.state.substance.list.forEach(sub => {
          if (sub.attributes.sid === val) {
            obj = sub;
          }
        });
        this.loadForm(obj);
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
