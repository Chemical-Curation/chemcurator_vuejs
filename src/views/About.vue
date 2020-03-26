<template>
  <div class="about">
    <h1>This is an about page</h1>
    <h1>{{ uname }}</h1>
  </div>
</template>

<script>
export default {
  name: "About",
  computed: {
    uname() {
      return this.$store.state.auth.user;
    }
  }
};
</script>

<style scoped>
</style>
