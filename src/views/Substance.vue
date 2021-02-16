<template>
  <b-container fluid="true" class="mx-5">
    <div class="mb-3 d-flex justify-content-between">
      <div id="sidebar" v-show="ifSearchParameter">
        <SubstanceSidebar />
      </div>
      <div>
        <SubstanceSearchPanel
          :headerText="this.$route.query.search"
          @click="searchSelection($event)"
        />
      </div>
    </div>
    <b-row>
      <b-col cols="12" order="1" lg="4" order-lg="0">
        <SubstanceForm
          :compound="compound"
          :substance="substance"
          :isAuthenticated="isAuthenticated"
          :qcLevelOptions="qcLevelOptions"
          :sourceOptions="sourceOptions"
          :substanceTypeOptions="substanceTypeOptions"
        />
      </b-col>
      <b-col>
        <ChemicalEditors
          :initial-compound="compound"
          :editable="isAuthenticated"
          :substance="substance"
          :urlParam="urlParam"
          :options="options"
          @change="changed = $event"
        />
      </b-col>
    </b-row>
    <SynonymTable :substance-id="substance.id" :editable="isAuthenticated" />
    <SubstanceRelationshipTable
      class="mb-5"
      :substance-id="substance.id"
      :editable="isAuthenticated"
    />
    <ListTable class="mb-5" :substance-id="substance.id" />
  </b-container>
</template>

<script>
import ChemicalEditors from "@/components/ChemicalEditors";
import SubstanceSidebar from "@/components/substance/SubstanceSidebar";
import SubstanceForm from "@/components/substance/SubstanceForm";
import SynonymTable from "@/components/synonyms/agSynonymTable";
import SubstanceRelationshipTable from "@/components/substance/agSubstanceRelationshipTable";
import ListTable from "@/components/records/agRecordTable";
import SubstanceSearchPanel from "@/components/substance/SubstanceSearchPanel";
import { mapGetters, mapState } from "vuex";

export default {
  name: "home",
  data() {
    return {
      changed: false
    };
  },
  computed: {
    ...mapGetters("auth", ["isAuthenticated"]),
    ...mapGetters("compound", { compound: "getCompound" }),
    ...mapGetters("qcLevel", { qcLevelOptions: "getOptions" }),
    ...mapGetters("queryStructureType", {
      options: "getOptions",
      qstList: "list"
    }),
    ...mapGetters("source", { sourceOptions: "getOptions" }),
    ...mapState("substance", {
      substance: "detail",
      storedSearches: "searchResults"
    }),
    ...mapGetters("substanceType", { substanceTypeOptions: "getOptions" }),

    ifSearchParameter() {
      return !this.$route.query.search;
    },
    urlParam: function() {
      return (
        Boolean(this.$route.params.sid) || Boolean(this.$route.query.search)
      );
    }
  },
  watch: {
    $route: function(to, from) {
      if (from.query !== to.query && to.query.search) {
        this.runSearch();
      }
    }
  },
  methods: {
    checkChanged: function(event) {
      if (this.changed) {
        // below only needs to eval to a truthy value
        event.returnValue = "lose your changes?";
      }
    },
    runSearch: function() {
      this.$store
        .dispatch("substance/substanceSearch", {
          searchString: this.$route.query.search
        })
        .then(compound_type => {
          if (!compound_type || compound_type === "definedCompound") {
            this.$store.commit("compound/illdefinedcompound/clearState");
          }
        });
    },
    searchSelection: function(result) {
      // this.$router.push({ name: "substance_detail", params: { sid: result } });
      this.$store.dispatch("substance/storedSearch", result);
      console.log(result);
    }
  },
  components: {
    ChemicalEditors,
    SubstanceSidebar,
    SubstanceForm,
    SynonymTable,
    SubstanceRelationshipTable,
    ListTable,
    SubstanceSearchPanel
  },
  beforeCreate() {},
  created() {
    window.addEventListener("beforeunload", this.checkChanged);
  },
  mounted() {
    if (this.$route.params.sid) {
      this.$store.dispatch("substance/fetchSubstance", this.$route.params.sid);
    } else if (this.$route.query.search) {
      this.runSearch();
    }
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
