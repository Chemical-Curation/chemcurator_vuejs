<template>
  <div class="home">
    <HelloWorld msg="Welcome to ChemReg" />
    <ChemicalEditors />
  </div>
</template>

<script>
import HelloWorld from "@/components/HelloWorld";
import ChemicalEditors from "@/components/ChemicalEditors";

export default {
  name: "home",
  components: {
    HelloWorld,
    ChemicalEditors,
  }
};
</script>

<style scoped>
.home {
  width: 1024px;
  margin: auto;
}
</style>
