<template>
  <div id="app">
    <NavBar />
    <Alert />
    <transition>
      <router-view :key="$route.path" />
    </transition>
  </div>
</template>

<script>
import NavBar from "@/components/NavBar.vue";
import Alert from "@/components/Alert";

export default {
  name: "App",
  components: {
    NavBar,
    Alert
  }
};
</script>

<style>
body {
  background-color: #f0f0f0;
}
h1 {
  padding: 0;
  margin-top: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}
.slide-enter-active,
.slide-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}
.slide-enter,
.slide-leave-to {
  opacity: 0;
  transform: translateX(-30%);
}
</style>
