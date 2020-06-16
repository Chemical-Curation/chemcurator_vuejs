<template>
  <b-navbar toggleable="lg" type="dark" variant="primary" class="shadow mb-5">
    <router-link :to="{ name: 'home' }">
      <b-navbar-brand>
        <ChemregLogo color="white" size="35px" />
      </b-navbar-brand>
    </router-link>
    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav>
        <b-nav-item :to="{ name: 'about' }">About</b-nav-item>
      </b-navbar-nav>
      <b-form-input
        class="search ml-auto"
        v-model="text"
        v-if="username"
        placeholder="Search Compounds"
      />
      <b-navbar-nav class="ml-auto">
        <b-nav-item :to="{ name: 'login' }" v-if="!isAuthenticated">Login</b-nav-item>
        <b-nav-item-dropdown name="user-profile" right v-if="username">
          <template v-slot:button-content>
            <span>
              <b-icon icon="person-fill" />
              {{ username }}
            </span>
          </template>
          <b-dropdown-item name="logout" @click="logout">Log Out</b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import ChemregLogo from "@/components/ChemregLogo";

export default {
  name: "NavBar",
  props: {
    text: String
  },
  computed: {
    ...mapState("auth", ["username"]),
    ...mapGetters("auth", ["isAuthenticated"])
  },
  methods: {
    logout: function() {
      this.$store.dispatch("auth/logout");
    }
  },
  components: {
    ChemregLogo
  }
};
</script>

<style scoped>
img {
  margin-right: 5px;
}
.search {
  width: 30%;
}
</style>
