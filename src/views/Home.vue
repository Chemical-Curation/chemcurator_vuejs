<template>
  <b-container fluid="true" class="mx-5">
    <HelloWorld msg="Welcome to ChemReg" />
    <b-row>
      <b-col cols="4">
        <SubstanceForm />
      </b-col>
      <b-col>
        <ChemicalEditors />
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import HelloWorld from "@/components/HelloWorld";
import ChemicalEditors from "@/components/ChemicalEditors";
import SubstanceForm from "@/components/SubstanceForm";

export default {
  name: "home",
  components: {
    HelloWorld,
    ChemicalEditors,
    SubstanceForm
  }
};
</script>

<style scoped>
.home {
  width: 1024px;
  margin: auto;
}
</style>
