<template>
  <b-navbar toggleable="lg" type="dark" variant="primary" class="shadow mb-2">
    <component :is="isAuthenticated ? 'router-link' : 'span'" :to="{ name: 'home' }">
      <b-navbar-brand>
        <ChemregLogo color="white" size="35px" />
      </b-navbar-brand>
    </component>
    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav>
        <b-nav-item :to="{ name: 'about' }" v-if="isAuthenticated">About</b-nav-item>
      </b-navbar-nav>
      <b-navbar-nav class="ml-auto">
        <b-form-input
          class="mr-2 search"
          v-model="searchString"
          v-if="username"
          placeholder="Search Compounds (cid or inchikey)"
        />
        <b-button
          class="mr-2"
          variant="dark"
          @click="searchCompound"
          v-if="username"
          :disabled="searchString.length == 0"
        >
          <b-icon icon="search" />
        </b-button>
      </b-navbar-nav>
      <b-navbar-nav class="ml-auto">
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
  data: function() {
    return {
      searchString: ""
    };
  },
  computed: {
    ...mapState("auth", ["username"]),
    ...mapGetters("auth", ["isAuthenticated"])
  },
  methods: {
    logout: function() {
      this.$store.dispatch("auth/logout");
    },
    searchCompound: function() {
      this.$store.dispatch("compound/fetchCompound", this.searchString);
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
  width: 311px;
}
</style>
