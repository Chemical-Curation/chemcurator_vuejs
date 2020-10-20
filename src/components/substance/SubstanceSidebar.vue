<template>
  <div>
    <b-button v-b-toggle.substance-sidebar class="btn btn-primary btn-sm"
      >Toggle Sidebar</b-button
    >
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
        obj[dt][user].push(substance.attributes.sid);
      });
      let abuelas = []; // array of objects to pass to tree
      let idCount = 0;
      Object.keys(obj).forEach(date => {
        let mamas = [];
        Object.keys(obj[date]).forEach(user => {
          let hijas = [];
          obj[date][user].forEach(substance => {
            hijas.push({ name: substance, icon: "egg-fried", id: idCount++ });
          });
          mamas.push({ name: user, icon: "person-fill", children: hijas, id: idCount++ });
        });
        abuelas.push({ name: date, icon: "calendar", children: mamas, id: idCount++});
      });
      return abuelas;
    }
  },
  mounted() {
    this.$store.dispatch("substance/getList");
  }
};
</script>

<style scoped></style>
