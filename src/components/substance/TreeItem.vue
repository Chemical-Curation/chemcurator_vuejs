<template>
  <li>
    <div :class="{ bold: isFolder }" @click="toggle">
      <b-icon :icon="item.icon"></b-icon>
      {{ item.name }}
      <span v-if="isFolder">[{{ isOpen ? "-" : "+" }}]</span>
    </div>
    <ul v-show="isOpen" v-if="isFolder">
      <TreeItem
        class="item"
        v-for="(child, index) in item.children"
        :key="index"
        :item="child"
      ></TreeItem>
    </ul>
  </li>
</template>

<script>
//calendar
//person-fill
//egg-fried
export default {
  name: "TreeItem",
  props: {
    item: Object
  },
  data: function() {
    return {
      isOpen: false,
      icon: "egg-fried"
    };
  },
  computed: {
    isFolder: function() {
      return this.item.children && this.item.children.length;
    }
  },
  methods: {
    toggle: function() {
      if (this.isFolder) {
        this.isOpen = !this.isOpen;
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
