<template>
  <b-container>
    <Title :msg="message" />
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
      return this.$store.state.list.attributes.name + " Details";
    }
  }
};
</script>

<style scoped></style>
