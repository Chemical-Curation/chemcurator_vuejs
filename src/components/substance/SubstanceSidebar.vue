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
      // organize to keys in an Object
      let obj = {};
      data.forEach(substance => {
        let dt = new Date(substance.attributes.updatedAt)
          .toISOString()
          .split("T")[0];
        let user = substance.relationships.updatedBy.data.id;
        if (!Object.keys(obj).includes(dt)) {
          obj[dt] = {};
        }
        if (!Object.keys(obj[dt]).includes(user)) {
          obj[dt][user] = [];
        }
        obj[dt][user].push({ id: substance.id, sid: substance.attributes.sid });
      });
      // reformat obj to array of date objects for tree
      let dates = []; // array of dates to pass to tree
      let idCount = 0; // increment an int for unique val in key binding
      Object.keys(obj).forEach(date => {
        let users = []; // array of users for the children of date
        Object.keys(obj[date]).forEach(user => {
          let substances = []; // array of substances for children of user
          obj[date][user].forEach(substance => {
            substances.push({
              name: substance.sid,
              icon: "egg-fried",
              children: [], // substances have no children
              id: substance.id
            });
          });
          users.push({
            name: user,
            icon: "person-fill",
            children: substances,
            id: idCount++
          });
        });
        dates.push({
          name: date,
          icon: "calendar",
          children: users,
          id: idCount++
        });
      });
      return dates;
    }
  },
  mounted() {
    this.$store.dispatch("substance/getList");
  }
};
</script>

<style scoped></style>
