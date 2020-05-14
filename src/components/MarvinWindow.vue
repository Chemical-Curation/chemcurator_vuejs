<template>
  <div>
    <iframe id="marvin" class="marvin" data-cy="marvin" v-bind:src="marvinURL"
      >marvin</iframe
    >
  </div>
</template>

<script>
export default {
  name: "MarvinWindow",
  data() {
    return {
      marvinURL: process.env.VUE_APP_MARVIN_URL + "/editorws.html"
    };
  },
  computed: {
    mrvfile: {
      set: function(newValue) {
        document
          .getElementById("marvin")
          .contentWindow.postMessage(
            `{"method": "importStructure", "args": ["mrv", "${newValue.replace(
              /"/g,
              "'"
            )}"]}`,
            "*"
          );
      }
    }
  }
};
</script>

<style scoped>
#marvin {
  overflow: hidden;
  width: 800px;
  height: 600px;
}
</style>
