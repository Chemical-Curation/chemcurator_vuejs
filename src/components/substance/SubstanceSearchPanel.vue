<template>
  <div>
    <b-button v-b-toggle.substance-search-panel class="btn btn-primary btn-sm">
      Toggle Search Results
    </b-button>
    <b-sidebar id="substance-search-panel" right shadow>
      <div class="substance-search-panel-header text-center">
        <h3 id="header-text">{{ headerText }}</h3>
      </div>
      <div class="substance-search-panel-results text-center">
        <search-node
          v-for="(result, index) in storedSearches"
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
      alert(result.id);
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
