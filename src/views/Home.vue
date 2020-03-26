<template>
  <div class="home">
    <HelloWorld msg="Welcome to ChemReg" />
    <KetcherWindow />
  </div>
</template>

<script>
// @ is an alias to /src
// import { doIt } from "@/backend";
import HelloWorld from "@/components/HelloWorld.vue";
import KetcherWindow from "../components/KetcherWindow";

export default {
  name: "home",
  components: {
    HelloWorld,
    KetcherWindow
  }
};
</script>

<style scoped>
.home {
  width: 1024px;
  margin: auto;
}
</style>
