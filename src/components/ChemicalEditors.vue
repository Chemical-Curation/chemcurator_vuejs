<template>
  <div>
    <Alert />
    <b-form-select id="compound-type-dropdown" v-model="type" :options="options" class="m-1 w-25" />
    <KetcherWindow v-if="type == 'definedCompound'" />
    <MarvinWindow v-if="type == 'illDefinedCompound'" />
  </div>
</template>

<script>
import { mapState } from "vuex";
import KetcherWindow from "@/components/KetcherWindow";
import MarvinWindow from "@/components/MarvinWindow";
import Alert from "@/components/Alert";

export default {
  name: "ChemicalEditors",
  components: {
    KetcherWindow,
    MarvinWindow,
    Alert
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
    ...mapState("compound", ["cid"])
  }
};
</script>

<style scoped>
.editor {
  width: 800px;
  margin: auto;
}
</style>
