<template>
    <ul>
      <div v-for="item in items" :key="item.id">
        <TreeItem class="item" :item="item" :key="item.id" />
      </div>
    </ul>
</template>

<script>
import TreeItem from "@/components/substance/TreeItem";

export default {
  name: "SubstanceTree",
  components: {
    TreeItem
  },
  props: {
    items: Array
  }
};
</script>

<style scoped>
ul {
  list-style: none;
}
</style>
