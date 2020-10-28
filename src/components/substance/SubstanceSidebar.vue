<template>
  <div>
    <b-button v-b-toggle.substance-sidebar class="btn btn-primary btn-sm">
      Toggle Sidebar
    </b-button>
    <b-sidebar id="substance-sidebar" shadow>
      <SubstanceTree :items="treeData" />
    </b-sidebar>
  </div>
</template>

<script>
import SubstanceTree from "@/components/substance/SubstanceTree";

export default {
  name: "SubstanceSidebar",
  components: {
    SubstanceTree
  },
  computed: {
    treeData: function() {
      let data = this.$store.state.substance.list;
      let included = this.$store.state.substance.included;
      // create an array of date objects with nested children
      let dates = [];
      data.forEach(substance => {
        let dt = substance.attributes.updatedAt;
        let dateString;
        let user;
        if (!dt) {
          dateString = "Not Tracked";
        } else {
          dateString = new Date(dt).toISOString().split("T")[0];
        }
        let userData = substance.relationships.updatedBy.data;
        console.log(substance.relationships.updatedBy);
        if (!userData) {
          user = "Unknown User";
        } else {
          user = included.user[userData.id].attributes.username;
        }
        let dateObj = dates.filter(o => Object.keys(o).includes(dateString));
        if (dateObj.length < 1) {
          dateObj = { name: dateString, icon: "calendar", children: [] };
          dates.push(dateObj);
        }
        let userObj = dateObj.children.filter(u =>
          Object.keys(u).includes(user)
        );
        if (userObj.length < 1) {
          userObj = { name: user, icon: "person-fill", children: [] };
        }
        userObj.children.push({
          id: substance.id,
          name: substance.attributes.sid,
          icon: "pencil-square"
        });
        dateObj.children.push(userObj);
      });
      return dates;
    }
  },
  mounted() {
    this.$store.dispatch("substance/getList", {
      params: [
        { key: "sort", value: "-updatedAt,updatedBy" },
        { key: "include", value: "updatedBy" }
      ]
    });
  }
};
</script>

<style scoped></style>
