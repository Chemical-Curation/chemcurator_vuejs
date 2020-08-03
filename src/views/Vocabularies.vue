<template>
  <div>
    <Title msg="Controlled Vocabularies" />
    <div class="row">
      <div class="col-2 offset-1">
        <b-form-radio-group
          id="radio-type-select"
          class="d-flex flex-fill"
          v-model="type"
          :options="types"
          button-variant="outline-primary btn-light-hover"
          buttons
          stacked
        />
      </div>
      <div class="col-8">
        <VocabularyListTable :type="type" />
      </div>
    </div>
  </div>
</template>

<script>
import VocabularyListTable from "@/components/vocabulary/VocabularyListTable";
import Title from "@/components/HelloWorld";

export default {
  name: "Vocabulary",
  data() {
    let types = [
      {
        text: "QC Levels",
        value: "qcLevels"
      },
      {
        text: "Query Structure Types",
        value: "queryStructureTypes"
      },
      {
        text: "Relationship Types",
        value: "relationshipTypes"
      },
      {
        text: "Sources",
        value: "sources"
      },
      {
        text: "Substance Types",
        value: "substanceTypes"
      },
      {
        text: "Synonym Qualities",
        value: "synonymQualities"
      },
      {
        text: "Synonym Types",
        value: "synonymTypes"
      }
    ];
    return {
      types: types,
      // Set the default type as the first type.
      type: types[0].value
    };
  },
  components: {
    VocabularyListTable,
    Title
  }
};
</script>

<style scoped></style>
