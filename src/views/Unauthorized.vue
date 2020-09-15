<template>
  <b-container>
    <Title msg="Unauthorized User" />
    <h5>Please contact the site administrator to gain access</h5>
  </b-container>
</template>

<script>
import Title from "@/components/HelloWorld";

export default {
  name: "Unauthorized",
  components: {
    Title
  }
};
</script>

<style scoped></style>
