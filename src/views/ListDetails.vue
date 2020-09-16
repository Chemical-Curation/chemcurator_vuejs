<template>
  <b-container>
    <Title :msg="message" />
      <hr>
    <ListDetailsForm />
  </b-container>
</template>

<script>
import ListDetailsForm from "@/components/lists/ListDetailsForm";
import Title from "@/components/HelloWorld";

export default {
  name: "ListDetails",
  components: {
    ListDetailsForm,
    Title
  },
  computed: {
    message: function() {
      let listName = this.$store.state.list.data.attributes?.name ?? "";
      return  listName + " Details";
    }
  }
};
</script>

<style scoped></style>
