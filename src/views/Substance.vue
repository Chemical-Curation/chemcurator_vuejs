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
        <ChemicalEditors v-show="type !== 'none'" :type="type" />
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import HelloWorld from "@/components/HelloWorld";
import ChemicalEditors from "@/components/ChemicalEditors";
import SubstanceForm from "@/components/SubstanceForm";
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
    ...mapState("compound/definedcompound", { defAttr: "attributes" }),
    ...mapState("compound/illdefinedcompound", {
      illDefAttr: "attributes",
      illDefRel: "relationships"
    }),
    ...mapState("queryStructureType", { qstList: "list" }),

    cid: function() {
      if (this.type === "definedCompound") return this.defAttr.cid;
      else if (this.type === "none") return "";
      return this.illDefAttr.cid;
    },
    options: function() {
      return this.buildOptions(this.qstList);
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
    }
  },
  components: {
    HelloWorld,
    ChemicalEditors,
    SubstanceForm
  },
  mounted() {
    this.$store.dispatch("queryStructureType/getList");
  }
};
</script>

<style scoped>
.home {
  width: 1024px;
  margin: auto;
}
</style>
