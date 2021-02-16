<template>
  <div>
    <b-button
      v-b-toggle.substance-search-panel
      class="btn btn-primary btn-sm"
      data-cy="search-results-button"
    >
      Toggle Search Results
    </b-button>
    <b-sidebar id="substance-search-panel" right shadow>
      <div class="substance-search-panel-header text-center">
        <h3 id="header-text">{{ headerText }}</h3>
      </div>
      <div class="substance-search-panel-results text-center">
        <search-node
          data-cy="search-node"
          v-for="(result, index) in storedSearches"
          class="btn btn-outline-success mb-2 mx-1 btn-block"
          :key="index"
          :result="result"
          @click="$emit('click', result)"
        />
      </div>
    </b-sidebar>
  </div>
</template>

<script>
import { mapState } from "vuex";
import SearchNode from "@/components/substance/SearchNode";

export default {
  name: "SubstanceSearchPanel",
  props: {
    headerText: String,
    searchResults: Array
  },
  methods: {
    click: function(result) {
      this.$router.push({ name: "substance_detail", params: { sid: result } });
      // alert(result.id);
    }
  },
  components: {
    SearchNode
  },
  computed: {
    ...mapState("substance", { storedSearches: "searchResults" })
  }
};
</script>

<style scoped></style>
