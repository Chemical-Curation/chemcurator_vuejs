<template>
  <div id="app">
    <NavBar />
    <KetcherWindow/>
    <router-view />
  </div>
</template>

<script>
  import NavBar from "./components/NavBar";
  import KetcherWindow from "./components/KetcherWindow";

export default {
  name: "app",
  components: {
    NavBar, KetcherWindow
  }
};
</script>

<style lang="scss"></style>
