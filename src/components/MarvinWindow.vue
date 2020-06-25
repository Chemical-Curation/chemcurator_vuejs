<template>
  <div>
    <br />
    <iframe
      id="marvin"
      class="marvin compound"
      data-cy="marvin"
      v-bind:src="marvinURL"
      >marvin</iframe
    >
    <br />
    <b-button
      variant="secondary"
      v-on:click="exportMrvfile"
      style="width:800px"
      id="marvin-export-button"
    >
      <b-icon-file-arrow-down></b-icon-file-arrow-down>Export
    </b-button>
    <b-form-textarea
      id="marvin-import-textarea"
      v-model="mrvfile"
      rows="3"
      max-rows="6"
      placeholder="Paste mrvfile to import..."
      class="mx-auto mt-5"
      style="width:800px"
    ></b-form-textarea>
    <b-button
      variant="primary"
      v-on:click="importMrvfile"
      class="mt-2"
      style="width:800px"
      id="marvin-import-button"
    >
      <b-icon-file-arrow-up></b-icon-file-arrow-up>Import
    </b-button>
  </div>
</template>

<script>
export default {
  name: "MarvinWindow",
  data() {
    return {
      marvinURL: process.env.VUE_APP_MARVIN_URL + "/editorws.html",
      mrvfile: ""
    };
  },
  methods: {
    importMrvfile: function() {
      document
        .getElementById("marvin")
        .contentWindow.postMessage(
          { type: "importMrvfile", mrvfile: this.mrvfile },
          "*"
        );
    },
    loadMrvfile: function() {
      document.getElementById("marvin").contentWindow.postMessage(
        {
          type: "importMrvfile",
          mrvfile: this.$store.state.compound.mrvfile
        },
        "*"
      );
    },
    exportMrvfile: function() {
      document
        .getElementById("marvin")
        .contentWindow.postMessage({ type: "exportMrvfile" }, "*");
    }
  },
  computed: {
    filio: function() {
      return this.$store.state.compound.mrvfile;
    }
  },
  watch: {
    filio: function() {
      this.loadMrvfile();
    }
  },
  mounted() {
    let self = this;
    window.addEventListener(
      "message",
      function(event) {
        if (event.data.type == "returnMrvfile") {
          self.mrvfile = event.data.mrvfile;
          this.mrvfile = this.$store.state.compound.mrvfile;
        }
      },
      false
    );
    if (this.$store.state.compound.mrvfile !== "") {
      const load = this.loadMrvfile; // lexical this, goes away in setTimeout!
      setTimeout(function() {
        load();
      }, 300); // there is a bit of lag to get the .marvin element to load, thus, the timeout.
      this.mrvfile = this.$store.state.compound.mrvfile;
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
