<template>
  <b-container>
    <Title msg="Lists" />
    <ListTable />
  </b-container>
</template>

<script>
import ListTable from "@/components/lists/ListTable";
import Title from "@/components/HelloWorld";

export default {
  name: "Lists",
  components: {
    ListTable,
    Title
  }
};
</script>

<style scoped></style>
