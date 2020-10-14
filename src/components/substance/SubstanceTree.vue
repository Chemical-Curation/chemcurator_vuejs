<template>
  <div>
    <b-button v-b-toggle.substance-sidebar class="btn btn-primary btn-sm"
      >Toggle Sidebar</b-button
    >
    <b-sidebar id="substance-sidebar" shadow>
      <div class="px-3 py-2"></div>
      <b-tree-view :data="treeData"></b-tree-view>
    </b-sidebar>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";

export default {
  name: "SubstanceTree",
  props: {
    item: Object
  },
  data() {
    return {
      treeData: [
        {
          id: 0,
          name: "attributes.updatedAt",
          children: [
            {
              name: "relationships.updatedBy.data.id",
              children: [{ name: "attributes.sid" }]
            },
            {
              name: "relationships.updatedBy.data.id",
              children: [{ name: "attributes.sid" }]
            }
          ]
        }
      ]
    };
  },
  computed: {
    ...mapGetters("auth", ["isAuthenticated"]),
    ...mapState("substance", { substanceList: "list" })
  },
  mounted() {
    this.$store.dispatch("substance/getList");
  }
};
</script>

<style scoped></style>
