<template>
  <b-navbar toggleable="lg" type="dark" variant="primary" class="shadow mb-2">
    <router-link :to="{ name: 'home' }">
      <b-navbar-brand>
        <ChemregLogo color="white" size="35px" />
      </b-navbar-brand>
    </router-link>
    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav>
        <b-nav-item
          :to="{ name: 'controlled-vocabularies' }"
          v-if="isAuthenticated"
          >Vocabularies</b-nav-item
        >
        <b-nav-item :to="{ name: 'substance' }" v-if="isAuthenticated"
          >Substances</b-nav-item
        >
        <b-nav-item :to="{ name: 'lists' }" v-if="isAuthenticated"
          >Lists</b-nav-item
        >
      </b-navbar-nav>
      <b-navbar-nav class="ml-auto">
        <b-form-input
          class="mr-2 search"
          v-model="searchString"
          v-if="username"
          placeholder="Search Compounds (cid or inchikey)"
          data-cy="search-box"
          @keyup.enter="searchCompound"
        />
        <b-button
          class="mr-2"
          variant="dark"
          @click="searchCompound"
          v-if="username"
          :disabled="searchString.length == 0"
          data-cy="search-button"
        >
          <b-icon icon="search" />
        </b-button>
      </b-navbar-nav>
      <b-navbar-nav class="ml-auto">
        <b-nav-item-dropdown
          name="user-profile"
          right
          v-if="username"
          data-cy="user-dropdown"
        >
          <template v-slot:button-content>
            <span>
              <b-icon icon="person-fill" />
              {{ username }}
            </span>
          </template>
          <b-dropdown-item name="logout" @click="logout" data-cy="logout-button"
            >Log Out</b-dropdown-item
          >
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
      this.$store.dispatch("compound/fetchCompound", {
        searchString: this.searchString,
        push: true
      });
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
