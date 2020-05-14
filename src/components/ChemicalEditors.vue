<template>
  <div>
    <b-form-select
      id="compound-type-dropdown"
      v-model="selected"
      :options="options"
      class="m-5 w-25"
    ></b-form-select>
    <KetcherWindow v-if="selected == 'defined'" />
    <MarvinWindow v-if="selected == 'ill-defined'" />
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
      selected: "defined",
      options: [
        { value: "defined", text: "defined" },
        { value: "ill-defined", text: "ill-defined" }
      ]
    };
  }
};
</script>

<style scoped>
.editor {
  width: 800px;
  margin: auto;
}
</style>
