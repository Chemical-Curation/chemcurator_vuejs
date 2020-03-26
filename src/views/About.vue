<template>
  <div class="about">
    <h1>This is an about page</h1>
    <h1>{{ uname }}</h1>
  </div>
</template>

<script>
export default {
  name: "About",
  data() {
    return {
      uname: "this should never appear"
    };
  }
};
</script>

<style scoped>
</style>
