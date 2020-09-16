<template>
  <div>
    <b-form>
      <KetcherWindow v-show="type === 'definedCompound'" ref="ketcher "/>
      <MarvinWindow v-show="type !== 'definedCompound'" ref="marvin" />
      <div class="my-3">
        <b-button @click="save" variant="primary">Save Compound</b-button>
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
  methods: {
    save: function() {
      if (this.type === 'definedCompound'){
        //todo: this is not going to be implemented on this ticket
        // this.$refs['ketcher'].save()
      }
      else {
        this.$refs['marvin'].save()
      }
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
