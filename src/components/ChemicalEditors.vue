<template>
  <div>
    <b-form>
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
          label="Substance Type:"
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
      <KetcherWindow v-show="type === 'definedCompound'" />
      <MarvinWindow v-show="type === 'illDefinedCompound'" />
      <div class="my-3">
        <b-button type="submit" variant="primary">Save Compound</b-button>
      </div>
    </b-form>
  </div>
</template>

<script>
import KetcherWindow from "@/components/KetcherWindow";
import MarvinWindow from "@/components/MarvinWindow";

export default {
  name: "ChemicalEditors",
  components: {
    KetcherWindow,
    MarvinWindow
  },
  data() {
    return {
      options: [
        { value: "definedCompound", text: "defined" },
        { value: "illDefinedCompound", text: "ill-defined" }
      ]
    };
  },
  computed: {
    type: {
      get() {
        return this.$store.state.compound.type;
      },
      set(value) {
        this.$store.commit("compound/setType", value);
      }
    },
    cid: function() {
      if (this.type === "definedCompound") {
        return this.$store.state.compound.definedcompound.attributes.cid;
      }
      if (this.type === "illDefinedCompound") {
        return this.$store.state.compound.illdefinedcompound.attributes.cid;
      }
      return "Undefined Type";
    }
  }
};
</script>

<style scoped>
.editor {
  width: 800px;
  margin: auto;
}
</style>
