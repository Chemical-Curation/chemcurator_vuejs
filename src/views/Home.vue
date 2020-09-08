<template>
  <b-row class="about">
    <b-col cols="3">
      <HelloWorld msg="Welcome to ChemReg" />
      <p v-if="username"></p>
      <LoginCard v-else />
    </b-col>
    <b-col>
      <p class="lead text-justify">{{ aboutBlurb }}</p>
      <b-card-group deck>
        <b-card class="list-count" title="Lists" border-variant="light">
          <h4>{{ listCount }}</h4>
        </b-card>
        <b-card
          class="substance-count"
          title="Substances"
          border-variant="light"
        >
          <h4>{{ substanceCount }}</h4>
        </b-card>
        <b-card class="compound-count" title="Compounds" border-variant="light">
          <h4>{{ compoundCount }}</h4>
        </b-card>
      </b-card-group>
    </b-col>
    <b-col cols="1"></b-col>
  </b-row>
</template>

<script>
import HelloWorld from "@/components/HelloWorld";
import LoginCard from "@/components/LoginCard";
import { mapState, mapGetters } from "vuex";

export default {
  name: "Home",
  components: {
    HelloWorld,
    LoginCard
  },
  computed: {
    ...mapState("auth", ["username"]),
    ...mapGetters("auth", ["isAuthenticated"]),
    aboutBlurb: function() {
      return "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
    },
    compoundCount() {
      return this.$store.state.compound.count || "";
    },
    substanceCount() {
      return this.$store.state.substance.count || "";
    },
    listCount() {
      return this.$store.state.list.count || "";
    }
  },
  beforeMount() {
    this.loadData();
  },
  methods: {
    loadData() {
      this.$store.dispatch("compound/getList");
      this.$store.dispatch("substance/getList");
      this.$store.dispatch("list/getList");
    }
  }
};
</script>

<style scoped></style>
