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
      // Currently non-Dyanmic - Need to figure out a way to dynamically grab Substances that correspond with User
      treeData: [
        {
          name: "attributes.updatedAt",
          children: [
            {
              name: "relationships.updatedBy.data.id",
              children: [{ name: "attributes.sid" }]
              // Load related compound based on SID
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
    ...mapState("substance", { substanceList: "list" }),
    ...mapGetters("auth", ["isAuthenticated"]),
    // Load related form based on SID ?
    ...mapGetters("compound/definedcompound", {
      getDefSubstanceForm: "getSubstanceForm"
    }),
    ...mapGetters("compound/illdefinedcompound", {
      getIndefSubstanceForm: "getSubstanceForm"
    }),
  },
  mounted() {
    this.$store.dispatch("substance/getList");
  }
};
</script>

<style scoped></style>
