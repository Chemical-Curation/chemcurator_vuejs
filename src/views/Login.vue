<template>
  <div>
    <div class="row justify-content-center py-5">
      <ChemregLogo size="100px" v-bind:animate="true" />
    </div>
    <div class="row justify-content-center">
      <LoginCard />
    </div>
  </div>
</template>

<script>
import ChemregLogo from "@/components/ChemregLogo";
import LoginCard from "@/components/LoginCard";

export default {
  name: "Login",
  components: {
    ChemregLogo,
    LoginCard
  }
};
</script>

<style scoped></style>
