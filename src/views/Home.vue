<template>
  <div class="home">
    <HelloWorld msg="Welcome to ChemReg" />
    <KetcherWindow />
  </div>
</template>

<script>
import HelloWorld from "@/components/HelloWorld";
import KetcherWindow from "@/components/KetcherWindow";

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
