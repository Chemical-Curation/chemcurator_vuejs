<template>
  <div>
    <b-table
      id="vocabulary-list-table"
      class="text-left"
      striped
      hover
      :items="vocabularyList"
      :fields="sourceTableFields"
    />
  </div>
</template>

<script>
export default {
  name: "Vocabulary",
  props: {
    type: String
  },
  data() {
    return {
      sourceTableFields: [
        {
          key: "attributes.name",
          label: "Name"
        },
        {
          key: "attributes.label",
          label: "Label"
        },
        {
          key: "attributes.shortDescription",
          label: "Description"
        }
      ]
    };
  },
  methods: {
    getList: function() {
      this.$store.dispatch("vocabularies/getList", this.type);
    }
  },
  watch: {
    type: function() {
      this.getList();
    }
  },
  computed: {
    vocabularyList: function() {
      return this.$store.state.vocabularies.list;
    }
  },
  mounted() {
    this.getList();
  }
};
</script>

<style scoped></style>
