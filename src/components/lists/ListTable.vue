<template>
  <div>
    <b-table
      id="list-table"
      class="text-left"
      striped
      hover
      :items="list"
      :fields="fields"
      @row-clicked="showRow"
    />
  </div>
</template>

<script>
import router from "@/router"

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
      this.$store.dispatch("list/getList", "lists");
    },
    showRow: function(row) {
      router.push({path: `/lists/${row.id}`})
    }
  },
  computed: {
    list: function() {
      return this.$store.state.list.list;
    }
  },
  mounted() {
    this.getList();
  }
};
</script>

<style scoped></style>
