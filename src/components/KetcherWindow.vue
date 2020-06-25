<template>
  <div>
    <br />
    <iframe
      id="ketcher"
      class="ketcher"
      data-cy="ketcher"
      v-bind:src="ketcherURL"
      width="800"
      height="600"
    >
      ketcher
    </iframe>
    <br />
    <b-button
      variant="secondary"
      v-on:click="exportMolfile"
      style="width:800px"
      id="ketcher-export-button"
    >
      <b-icon-file-arrow-down></b-icon-file-arrow-down>Export
    </b-button>
    <b-form-textarea
      id="ketcher-import-textarea"
      v-model="molfile"
      rows="3"
      max-rows="6"
      placeholder="Paste molfile to import..."
      class="mx-auto mt-5"
      style="width:800px"
    ></b-form-textarea>
    <b-button
      variant="primary"
      v-on:click="importMolfile"
      class="mt-2"
      style="width:800px"
      id="ketcher-import-button"
    >
      <b-icon-file-arrow-up></b-icon-file-arrow-up>Import
    </b-button>
  </div>
</template>

<script>
export default {
  name: "KetcherWindow",
  data() {
    return {
      ketcherURL: process.env.VUE_APP_KETCHER_URL,
      molfile: ""
    };
  },
  methods: {
    importMolfile: function() {
      document
        .getElementById("ketcher")
        .contentWindow.postMessage(
          { type: "importMolfile", molfile: this.molfile },
          "*"
        );
    },
    loadMolfile: function() {
      document.getElementById("ketcher").contentWindow.postMessage(
        {
          type: "importMolfile",
          molfile: this.$store.state.compound.molfile
        },
        "*"
      );
    },
    exportMolfile: function() {
      document
        .getElementById("ketcher")
        .contentWindow.postMessage({ type: "exportMolfile" }, "*");
    }
  },
  computed: {
    filio: function() {
      return this.$store.state.compound.molfile;
    }
  },
  watch: {
    filio: function() {
      this.loadMolfile();
    }
  },
  mounted() {
    let self = this;
    window.addEventListener(
      "message",
      function(event) {
        if (event.data.type == "returnMolfile") {
          self.molfile = event.data.molfile;
          this.molfile = this.$store.state.compound.molfile;
        }
      },
      false
    );
    if (this.$store.state.compound.molfile !== "") {
      const load = this.loadMolfile; // lexical this, goes away in setTimeout!
      setTimeout(function() {
        load();
      }, 300); // there is a bit of lag to get the .ketcher element to load, thus, the timeout.
      this.molfile = this.$store.state.compound.molfile;
    }
  }
};
</script>
