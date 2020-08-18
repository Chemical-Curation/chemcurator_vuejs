<template>
  <div>
    <b-table
      id="list-table"
      class="text-left"
      striped
      hover
      :items="list"
      :fields="fields"
    />
  </div>
</template>

<script>
export default {
  name: "List",
  props: {},
  data() {
    return {
      fields: [
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
          label: "Short Description"
        }
      ]
    };
  },
  methods: {
    getList: function() {
      this.$store.dispatch("lists/getList");
    }
  },
  watch: {
    type: function() {
      this.getList();
    }
  },
  computed: {
    list: function() {
      return this.$store.state.lists.list;
    }
  },
  mounted() {
    this.getList();
  }
};
</script>

<style scoped></style>
