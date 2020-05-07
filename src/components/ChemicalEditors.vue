<template>
  <b-tabs class="editor" content-class="mt-3" 
      active-nav-item-class="font-weight-bold" fill>
    <b-tab title="Ketcher" active>
        <KetcherWindow />
    </b-tab>
    <b-tab title="Marvin">
        <MarvinWindow />
    </b-tab>
  </b-tabs>
</template>

<script>
import KetcherWindow from "@/components/KetcherWindow";
import MarvinWindow from "@/components/MarvinWindow";

export default {
  name: "ChemicalEditors",
  components: {
    KetcherWindow,
    MarvinWindow
  }
};
</script>

<style scoped>
.editor {
  width: 800px;
  margin: auto;
}
</style>
