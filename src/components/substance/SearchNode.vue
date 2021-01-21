<template>
  <div @click="$emit('click')">
    <div>
      {{ result.id }}
    </div>
    <ul class="list-group">
      <li
        class="list-group-item d-flex justify-content-between align-item-center"
        v-for="(score, match, index) in result.attributes.matches"
        :key="index"
      >
        {{ match }}
        <span> {{ score }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "SearchNode",
  props: {
    result: Object
  },
  components: {}
};
</script>

<style scoped></style>
