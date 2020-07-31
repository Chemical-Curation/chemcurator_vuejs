<template>
  <div>
    <b-table
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
          key: "attributes.label",
          label: "Name"
        },
        {
          key: "attributes.short_description",
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
