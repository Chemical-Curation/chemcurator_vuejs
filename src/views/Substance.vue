<template>
  <b-container fluid="true" className="mx-5">
    <HelloWorld msg="Welcome to ChemReg"/>
    <b-row>
      <b-col cols="12" order="1" lg="4" order-lg="0">
        <SubstanceForm/>
      </b-col>
      <b-col>
        <ChemicalEditors/>
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
