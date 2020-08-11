<template>
  <b-row class="about">
    <b-col cols="3">
      <ChemregLogo size="100px" v-bind:animate="true" />
      <p v-if="username" class="text-left">Welcome, {{ username }}.</p>
      <LoginCard v-else />
    </b-col>
    <b-col>
      <p
        class="lead text-justify"
      >Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
    </b-col>
    <b-col cols="1"></b-col>
  </b-row>
</template>

<script>
import ChemregLogo from "@/components/ChemregLogo";
import LoginCard from "@/components/LoginCard";
import { mapState, mapGetters } from "vuex";

export default {
  name: "About",
  computed: {
    ...mapState("auth", ["username"]),
    ...mapGetters("auth", ["isAuthenticated"])
  },
  components: {
    ChemregLogo,
    LoginCard
  }
};
</script>

<style scoped></style>
