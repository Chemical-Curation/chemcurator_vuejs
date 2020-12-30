<template>
  <b-container fluid="true" class="mx-5">
    <SubstanceSidebar />
    <SubstanceSearchPanel />
    <b-row>
      <b-col cols="12" order="1" lg="4" order-lg="0">
        <SubstanceForm />
      </b-col>
      <b-col>
        <ChemicalEditors
          :initial-compound="compound"
          :editable="isAuthenticated"
          @change="changed = $event"
        />
      </b-col>
    </b-row>
    <SynonymTable :substance-id="substance.id" :editable="isAuthenticated" />
    <SubstanceRelationshipTable class="mb-5" :substance-id="substance.id" />
    <ListTable class="mb-5" :substance-id="substance.id" />
  </b-container>
</template>

<script>
import ChemicalEditors from "@/components/ChemicalEditors";
import compoundApi from "@/api/compound";
import ListTable from "@/components/records/agRecordTable";
import SubstanceForm from "@/components/substance/SubstanceForm";
import SubstanceRelationshipTable from "@/components/substance/agSubstanceRelationshipTable";
import SubstanceSearchPanel from "@/components/substance/SubstanceSearchPanel";
import SubstanceSidebar from "@/components/substance/SubstanceSidebar";
import SynonymTable from "@/components/synonyms/agSynonymTable";
import { mapGetters, mapState } from "vuex";

export default {
  name: "home",
  data() {
    return {
      compound: {},
      changed: false
    };
  },
  computed: {
    ...mapGetters("auth", ["isAuthenticated"]),
    ...mapState("substance", { substance: "detail" }),
    ...mapState("queryStructureType", { qstList: "list" })
  },
  watch: {
    substance: function() {
      if (this.substance?.relationships.associatedCompound.data?.id)
        this.fetchCompound(
          this.substance?.relationships.associatedCompound.data?.id
        );
    }
  },
  methods: {
    fetchCompound: async function(cid) {
      this.compound = await compoundApi.fetchCompound(cid);
    },
    checkChanged: function(event) {
      if (this.changed) {
        // below only needs to eval to a truthy value
        event.returnValue = "lose your changes?";
      }
    }
  },
  components: {
    ChemicalEditors,
    SubstanceForm,
    SubstanceRelationshipTable,
    SubstanceSearchPanel,
    SubstanceSidebar,
    SynonymTable,
    ListTable
  },
  created() {
    window.addEventListener("beforeunload", this.checkChanged);
  },
  mounted() {
    this.$store.dispatch("queryStructureType/getList");
    this.$store.dispatch("source/getList");
    this.$store.dispatch("qcLevel/getList");
    this.$store.dispatch("substanceType/getList");
    this.$store.dispatch("substance/getList", {
      params: [
        { key: "sort", value: "-updatedAt,updatedBy" },
        { key: "include", value: "updatedBy" }
      ]
    });
  },
  beforeRouteLeave(to, from, next) {
    if (this.changed) {
      this.$bvModal
        .msgBoxConfirm(
          "Unsaved changes exist on the compound in the editor, are you okay with losing the changes?",
          {
            okTitle: "YES",
            cancelTitle: "NO"
          }
        )
        .then(value => {
          if (value) {
            next();
          } else {
            next(false);
          }
        });
    } else {
      next();
    }
  }
};
</script>

<style scoped>
.home {
  width: 1024px;
  margin: auto;
}
</style>
