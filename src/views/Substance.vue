<template>
  <b-container fluid="true" class="mx-5">
    <b-row>
      <b-col cols="12" order="1" lg="4" order-lg="0">
        <SubstanceForm :type="type" />
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
              :options="options"
            />
          </b-form-group>
        </div>
        <ChemicalEditors v-show="type !== 'none'" :type="type" />
      </b-col>
    </b-row>
    <SynonymTable :substance-id="substanceId" />
    <SubstanceRelationshipTable class="mb-5" :substance-id="substanceId" />
  </b-container>
</template>

<script>
import ChemicalEditors from "@/components/ChemicalEditors";
import SubstanceForm from "@/components/SubstanceForm";
import SynonymTable from "@/components/synonyms/SynonymTable";
import SubstanceRelationshipTable from "@/components/SubstanceRelationshipTable";
import { mapState } from "vuex";

export default {
  name: "home",
  data() {
    return {
      type: "none"
    };
  },
  computed: {
    ...mapState("compound", { compoundType: "type" }),
    ...mapState("compound/definedcompound", { definedCompoundData: "data" }),
    ...mapState("compound/illdefinedcompound", {
      illDefinedCompoundData: "data"
    }),
    ...mapState("queryStructureType", { qstList: "list" }),

    cid: function() {
      if (this.type === "definedCompound")
        return this.definedCompoundData.attributes?.cid;
      else if (this.type === "none") return "";
      return this.illDefinedCompoundData.attributes?.cid;
    },
    options: function() {
      return this.buildOptions(this.qstList);
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
    buildOptions: function(list) {
      let item;
      let options = [
        { value: "none", text: "None" },
        { value: "definedCompound", text: "Defined Compound" }
      ];
      for (item of list)
        options.push({ value: item.id, text: item.attributes.label });
      return options;
    },
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
    SubstanceForm,
    SynonymTable,
    SubstanceRelationshipTable
  },
  created() {
    window.addEventListener("beforeunload", this.checkChanged);
  },
  mounted() {
    this.$store.dispatch("queryStructureType/getList");
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
