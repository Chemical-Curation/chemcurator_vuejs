<template>
  <div>
    <br />
    <iframe
      id="ketcher"
      class="ketcher"
      data-cy="ketcher"
      v-bind:src="ketcherURL"
      @load="ketcherLoaded"
      width="800"
      height="600"
    >
      ketcher
    </iframe>
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
      this.exportMolfile();
    },
    exportMolfile: function() {
      document
        .getElementById("ketcher")
        .contentWindow.postMessage({ type: "exportMolfile" }, "*");
    },
    ketcherLoaded: function() {
      this.ketcherInterval = setInterval(() => {
        this.exportMolfile();
      }, 1000);
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
    },
    molfile: () => {
      // console.log("molfile changed");
    }
  },
  mounted() {
    let self = this;
    window.addEventListener(
      "message",
      function(event) {
        if (event.data.type == "returnMolfile") {
          self.molfile = event.data.molfile;
          this.molfile = self.$store.state.compound.molfile;
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
  },
  beforeDestroy() {
    clearInterval(this.ketcherInterval);
  }
};
</script>
