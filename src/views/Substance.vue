<template>
  <b-container fluid="true" class="mx-5">
    <SubstanceSidebar />
    <b-row>
      <b-col cols="12" order="1" lg="4" order-lg="0">
        <SubstanceForm />
      </b-col>
      <b-col>
        <div class="row mb-3">
          <b-form-group
            label="Record Compound ID:"
            label-align="left"
            label-cols="4"
            label-for="recordCompoundID"
            class="col"
          >
            <b-form-input id="recordCompoundID" :value="cid" disabled />
          </b-form-group>
          <b-form-group
            label="Structure Type:"
            label-align="left"
            label-cols="4"
            label-for="compound-type-dropdown"
            class="col"
          >
            <b-form-select
              id="compound-type-dropdown"
              v-model="type"
              :options="options(type)"
            >
              <template #first>
                <option value="none">None</option>
                <option value="definedCompound">Defined Compound</option>
              </template>
            </b-form-select>
          </b-form-group>
        </div>
        <ChemicalEditors
          v-show="type !== 'none'"
          :type="type"
          :editable="isAuthenticated"
        />
      </b-col>
    </b-row>
    <SynonymTable :substance-id="substanceId" :editable="isAuthenticated" />
    <SubstanceRelationshipTable class="mb-5" :substance-id="substanceId" />
    <ListTable class="mb-5" :substance-id="substanceId" />
  </b-container>
</template>

<script>
import ChemicalEditors from "@/components/ChemicalEditors";
import SubstanceSidebar from "@/components/substance/SubstanceSidebar";
import SubstanceForm from "@/components/substance/SubstanceForm";
import SynonymTable from "@/components/synonyms/agSynonymTable";
import SubstanceRelationshipTable from "@/components/substance/agSubstanceRelationshipTable";
import ListTable from "@/components/records/agRecordTable";
import { mapGetters, mapState } from "vuex";

export default {
  name: "home",
  data() {
    return {
      type: "none"
    };
  },
  computed: {
    ...mapGetters("auth", ["isAuthenticated"]),
    ...mapGetters("queryStructureType", { options: "getOptions" }),
    ...mapState("compound", { compoundType: "type" }),
    ...mapState("compound/definedcompound", { definedCompoundData: "data" }),
    ...mapState("compound/illdefinedcompound", {
      illDefinedCompoundData: "data"
    }),
    ...mapState("queryStructureType", { qstList: "list" }),

    cid: function() {
      if (this.type === "definedCompound") return this.definedCompoundData.id;
      else if (this.type === "none") return "";
      return this.illDefinedCompoundData.id;
    },
    substanceId: function() {
      if (
        this.type === "definedCompound" &&
        this.definedCompoundData.relationships?.substance
      )
        return this.definedCompoundData.relationships?.substance?.data?.id;
      else if (this.illDefinedCompoundData.relationships?.substance)
        return this.illDefinedCompoundData.relationships?.substance?.data?.id;
      return "";
    }
  },
  watch: {
    compoundType: function() {
      this.type = this.compoundType;
    }
  },
  methods: {
    checkChanged: function(event) {
      if (
        this.$store.state.compound.illdefinedcompound.changed ||
        this.$store.state.compound.definedcompound.changed
      ) {
        // below only needs to eval to a truthy value
        event.returnValue = "lose your changes?";
      }
    }
  },
  components: {
    ChemicalEditors,
    SubstanceSidebar,
    SubstanceForm,
    SynonymTable,
    SubstanceRelationshipTable,
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
    if (
      this.$store.state.compound.illdefinedcompound.changed ||
      this.$store.state.compound.definedcompound.changed
    ) {
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
            this.$store.dispatch(
              "compound/definedcompound/updateChanged",
              false
            );
            this.$store.dispatch(
              "compound/illdefinedcompound/updateChanged",
              false
            );
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
