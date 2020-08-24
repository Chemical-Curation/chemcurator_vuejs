<template>
  <div>
    <b-form>
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
  props: {
    type: String
  },
};
</script>

<style scoped>
.editor {
  width: 800px;
  margin: auto;
}
</style>
