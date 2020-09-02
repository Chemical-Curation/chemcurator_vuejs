<template>
  <b-container fluid="true" class="mx-5">
    <HelloWorld msg="Welcome to ChemReg" />
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
        <ChemicalEditors :type="type" />
      </b-col>
    </b-row>
    <SynonymTable :substance-id="substanceId" />
  </b-container>
</template>

<script>
import HelloWorld from "@/components/HelloWorld";
import ChemicalEditors from "@/components/ChemicalEditors";
import SubstanceForm from "@/components/SubstanceForm";
import SynonymTable from "@/components/synonyms/SynonymTable";
import { mapState } from "vuex";

export default {
  name: "home",
  data() {
    return {
      type: "definedCompound",
      options: [
        { value: "definedCompound", text: "defined" },
        { value: "illDefinedCompound", text: "ill-defined" }
      ]
    };
  },
  computed: {
    ...mapState("compound/definedcompound", { defAttr: "attributes" }),
    ...mapState("compound/illdefinedcompound", { illDefAttr: "attributes" }),
    cid: function() {
      if (this.type === "definedCompound")
        return this.$store.state.compound.definedcompound.attributes.cid;
      else return this.$store.state.compound.illdefinedcompound.attributes.cid;
    },
    substanceId: function() {
      if (this.type === "definedCompound" && this.$store.state.compound.definedcompound.relationships.substance)
        return this.$store.state.compound.definedcompound.relationships.substance.data.id;
      else if (this.$store.state.compound.illdefinedcompound.relationships.substance)
        return this.$store.state.compound.illdefinedcompound.relationships.substance.data.id;
      return ""
    }
  },
  watch: {
    defAttr: function() {
      this.type = "definedCompound";
    },
    illDefAttr: function() {
      this.type = "illDefinedCompound";
    }
  },
  components: {
    HelloWorld,
    ChemicalEditors,
    SubstanceForm,
    SynonymTable
  }
};
</script>

<style scoped>
.home {
  width: 1024px;
  margin: auto;
}
</style>
