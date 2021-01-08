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
        <ul class="list-group">
          <li v-for="(result, index) in searchResults" v-bind:key="index">
            {{ result }}
          </li>
        </ul>
      </div>
    </b-sidebar>
  </div>
</template>

<script>
export default {
  name: "SubstanceSearchPanel",
  props: {
    headerText: String,
    searchResults: Array
  },
  components: {},
  computed: {}
};
</script>

<style scoped></style>
