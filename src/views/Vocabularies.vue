<template>
  <div class="container">
    <div>
      <h1 class="m-3">Controlled Vocabularies</h1>
    </div>
    <b-select
      v-model="type"
      :options="types"
    />
    <div class="mt-3">
      <VocabularyListTable :type="type"/>
    </div>
  </div>
</template>

<script>
import VocabularyListTable from "@/components/vocabulary/VocabularyListTable";

export default {
  name: "Vocabulary",
  data() {
    let types =  [
      {
        text: 'QC Levels',
        value: 'qcLevels'
      },
      {
        text: 'Query Structure Types',
        value: 'queryStructureTypes'
      },
      {
        text: 'Relationship Types',
        value: 'relationshipTypes'
      },
      {
        text: 'Sources',
        value: 'sources'
      },
      {
        text: 'Substance Types',
        value: 'substanceTypes'
      },
      {
        text: 'Synonym Qualities',
        value: 'synonymQualities'
      },
      {
        text: 'Synonym Types',
        value: 'synonymTypes'
      }
    ]
    return {
      types: types,
      // Set the default type as the first type.
      type: types[0].value
    }
  },
  components: {
    VocabularyListTable,
  },
};
</script>

<style scoped></style>
