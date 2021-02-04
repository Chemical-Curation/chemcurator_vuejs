<template>
  <div>
    <b-button
      v-b-toggle.substance-search-panel
      class="btn btn-primary btn-sm"
      v-if="searchResults.length > 0"
    >
      Toggle Search Results
    </b-button>
    <b-sidebar id="substance-search-panel" right shadow>
      <div class="text-center">
        <h3 id="header-text">{{ headerText }}</h3>
      </div>
      <button
        v-for="(result, index) in searchResults"
        :key="index"
        class="btn btn-outline-success mb-2 mx-1 btn-block"
        :disabled="index === 0"
        @click="gotToSubstance(result.id)"
      >
        <h4>{{ result.id }}</h4>
        <ul class="list-group">
          <li
            class=""
            v-for="(score, match, index) in result.attributes.matches"
            :key="index"
          >
            {{ match }}
            <span> {{ score }}</span>
          </li>
        </ul>
      </button>
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
  methods: {
    gotToSubstance: function(val) {
      this.$router.push({ name: "substance_detail", params: { sid: val } });
    }
  }
};
</script>

<style scoped>
ul {
  list-style: none;
}
</style>
