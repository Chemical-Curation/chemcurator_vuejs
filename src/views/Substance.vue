<template>
  <div class="substance">
    <ChemicalEditors />
  </div>
</template>

<script>
import ChemicalEditors from "@/components/ChemicalEditors";

export default {
  name: "substance",
  components: {
    ChemicalEditors
  }
};
</script>

<style scoped>
.substance {
  width: 1024px;
  margin: auto;
}
</style>
