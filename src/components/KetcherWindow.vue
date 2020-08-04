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
    >ketcher</iframe>
    <b-form-textarea
      id="ketcher-import-textarea"
      v-model="molfile"
      rows="3"
      max-rows="6"
      placeholder="Paste molfile to import..."
      class="mx-auto mt-5"
      style="width:800px"
      disabled
    ></b-form-textarea>
  </div>
</template>

<script>
export default {
  name: "KetcherWindow",
  data() {
    return {
      ketcherURL: process.env.VUE_APP_KETCHER_URL,
      ketcherInterval: null,
      molfile: ""
    };
  },
  methods: {
    loadMolfile: function() {
      document.getElementById("ketcher").contentWindow.postMessage(
        {
          type: "importMolfile",
          molfile: this.$store.state.compound.molfile
        },
        "*"
      );
      this.exportMolfile();
    },
    exportMolfile: function() {
      document
        .getElementById("ketcher")
        .contentWindow.postMessage({ type: "exportMolfile" }, "*");
    }
  },
  computed: {
    compound: function() {
      return this.$store.state.compound.molfile;
    }
  },
  watch: {
    compound: function() {
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
        }
      },
      false
    );
    if (this.$store.state.compound.molfile !== "") {
      const load = this.loadMolfile;
      var iFrame = document.getElementById("ketcher");
      iFrame.addEventListener("load", function() {
        load();
      });
    }
  }
};
</script>
