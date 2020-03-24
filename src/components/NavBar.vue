<template>
  <b-navbar toggleable="lg" type="light" variant="primary">
    <router-link :to="{ name: 'home' }">
      <b-navbar-brand>
        <img
          :src="require(`@/assets/logo_32px.png`)"
          class="d-inline-block"
          alt
        />
        ChemReg
      </b-navbar-brand>
    </router-link>
    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav>
        <b-nav-item :to="{ name: 'about' }">About</b-nav-item>
      </b-navbar-nav>
      <b-navbar-nav class="ml-auto">
        <b-nav-item :to="{ name: 'login' }" data-test="login" v-if="!isLoggedIn"
          >Login</b-nav-item
        >
        <b-nav-item-dropdown name="user-profile" right v-if="isLoggedIn">
          <template v-slot:button-content>
            <span class="h4">
              <b-icon icon="person-fill" />
              {{ user }}
            </span>
          </template>
          <b-dropdown-item name="logout" @click="logout"
            >Log Out</b-dropdown-item
          >
        </b-nav-item-dropdown>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script>
import { mapState, mapGetters } from "vuex";

export default {
  name: "navbar",
  computed: {
    ...mapState(["user"]),
    ...mapGetters(["isLoggedIn"])
  },
  methods: {
    logout: function() {
      this.$store.dispatch("logout").then(() => {
        this.$router.push("/login");
      });
    }
  }
};
</script>

<style scoped>
.navbar {
  font-weight: bold;
}
a.vue-active {
  font-size: 1.1em;
  text-decoration: underline;
}
img {
  margin-right: 5px;
}
</style>
