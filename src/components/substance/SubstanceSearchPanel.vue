<template>
  <div>
    <b-button v-b-toggle.substance-search-panel class="btn btn-primary btn-sm">
      Toggle Search Results
    </b-button>
    <b-sidebar id="substance-search-panel" right shadow>
      <div class="substance-search-panel-header text-center">
        <h3>Search Text Here</h3>
      </div>

      <div class="substance-search-panel-results text-center">
        <ul class="list-group">
          <li class="list-group-item">Result 1</li>
          <li class="list-group-item">Result 2</li>
          <li class="list-group-item">Result 3</li>
        </ul>
      </div>
    </b-sidebar>
  </div>
</template>

<script>
export default {
  name: "SubstanceSearchPanel",
  components: {},
  computed: {}
};
</script>

<style scoped></style>
