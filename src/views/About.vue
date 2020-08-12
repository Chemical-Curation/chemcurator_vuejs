<template>
  <b-row class="about">
    <b-col cols="3">
      <ChemregLogo size="100px" v-bind:animate="true" />
      <p v-if="username"></p>
      <LoginCard v-else />
    </b-col>
    <b-col>
      <h1 class="display-4">Welcome to Chemreg</h1>
      <p class="lead text-justify">{{ aboutBlurb }}</p>
      <b-card-group deck>
        <b-card title="Lists" border-variant="light">
          {{
          stats.listCount
          }}
        </b-card>
        <b-card title="Substances" border-variant="light">
          {{
          stats.substanceCount
          }}
        </b-card>
        <b-card title="Compounds" border-variant="light">
          {{
          stats.compoundCount
          }}
        </b-card>
      </b-card-group>
    </b-col>
    <b-col cols="1"></b-col>
  </b-row>
</template>

<script>
import ChemregLogo from "@/components/ChemregLogo";
import LoginCard from "@/components/LoginCard";
import { mapState, mapGetters } from "vuex";
import { HTTP } from "@/store/http-common";

export default {
  name: "About",
  computed: {
    ...mapState("auth", ["username"]),
    ...mapGetters("auth", ["isAuthenticated"]),
    aboutBlurb: function() {
      return "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
    }
  },
  components: {
    ChemregLogo,
    LoginCard
  },
  data() {
    return {
      stats: { substanceCount: 0, listCount: 0, compoundCount: 0 }
    };
  },
  beforeMount() {
    this.getStats();
  },
  methods: {
    async getStats() {
      await HTTP.get("/substances")
        .then(response => {
          this.stats["substanceCount"] = response.data.meta.pagination.count;
        })
        .catch(error => {
          this.stats["substanceCount"] = error;
        });

      await HTTP.get("/lists")
        .then(response => {
          this.stats["listCount"] = response.data.meta.pagination.count;
        })
        .catch(error => {
          this.stats["listCount"] = error;
        });

      await HTTP.get("/compounds")
        .then(response => {
          this.stats["compoundCount"] = response.data.meta.pagination.count;
        })
        .catch(error => {
          this.stats["compoundCount"] = error;
        });
    }
  }
};
</script>

<style scoped></style>
