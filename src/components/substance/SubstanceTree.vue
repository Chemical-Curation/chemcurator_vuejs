<template>
  <div>
  <ul>
    <div v-for="item in items" :key="item.id">
    <TreeItem
      class="item"
      :item="item"
    ></TreeItem >
    </div>
  </ul>
  </div>
</template>

<script>
import TreeItem from "@/components/substance/TreeItem";

export default {
  name: "SubstanceTree",
  components: {
    TreeItem
  },
  props: {
    items: Object
  },
  data() {
    return {
    }
    },
  methods: {
    addItem: function(item) {
      item.children.push({
        name: "new stuff"
      });
    }
  },
};
</script>

<style scoped>
ul {
  list-style: none;
}
</style>
