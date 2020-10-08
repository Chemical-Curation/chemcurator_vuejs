<template>
  <div>
    <div id="substanceInfoPanel" class="border rounded mb-3">
      <dl class="row my-1 p-2">
        <dt class="col-lg-2">Molecular Weight</dt>
        <dd class="col-lg-4 overflow-auto">{{ molecularWeight }}</dd>

        <dt class="col-lg-2">Molecular Formula</dt>
        <dd class="col-lg-4 overflow-auto">{{ molecularFormula }}</dd>

        <dt class="col-lg-2">SMILES</dt>
        <dd class="col-lg-4 overflow-auto">{{ smiles }}</dd>

        <dt class="col-lg-2">Inchikey</dt>
        <dd class="col-lg-4 overflow-auto">{{ inchikey }}</dd>
      </dl>
    </div>
    <div class="d-flex">
      <iframe
        id="ketcher"
        class="ketcher flex-fill"
        data-cy="ketcher"
        :src="ketcherURL"
        @load="loadMolfile"
        height="600"
        ref="ketcher"
        >ketcher</iframe
      >
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  name: "KetcherWindow",
  data() {
    return {
      ketcherURL: process.env.VUE_APP_KETCHER_URL,
      initial_molfile: "  0  0  0     0  0            999 V2000\nM  END",
      blank: "  0  0  0     0  0            999 V2000\nM  END",
      molfile: ""
    };
  },
  methods: {
    ...mapActions("compound/definedcompound", ["fetchByMolfile"]),
    loadMolfile: function() {
      if (this.data?.attributes?.molfileV3000) {
        this.ketcherFrame.contentWindow.postMessage(
          {
            type: "importMolfile",
            molfile: this.data.attributes.molfileV3000
          },
          "*"
        );
        this.exportMolfile();
      }
    },
    exportMolfile: function() {
      this.ketcherFrame.contentWindow.postMessage(
        { type: "exportMolfile" },
        "*"
      );
    },
    clearMolfile: function() {
      this.ketcherFrame.contentWindow.postMessage(
        { type: "clearMolfile" },
        "*"
      );
    },
    removeHeader: function(str) {
      return str
        .split("\n")
        .slice(3, -1)
        .join("\n");
    }
  },
  computed: {
    ...mapState("compound/definedcompound", ["data"]),
    ketcherFrame: function() {
      return this.$refs.ketcher;
    },
    molecularWeight: function() {
      return this.data.attributes?.molecularWeight ?? "-";
    },
    molecularFormula: function() {
      return this.data.attributes?.molecularFormula ?? "-";
    },
    smiles: function() {
      return this.data.attributes?.smiles ?? "-";
    },
    inchikey: function() {
      return this.data.attributes?.inchikey ?? "-";
    }
  },
  watch: {
    data: function() {
      if (this.data?.attributes?.molfileV3000) {
        this.loadMolfile();
      }
    },
    molfile: function() {
      this.fetchByMolfile(this.molfile);
      let temp = this.removeHeader(this.molfile);
      if (temp !== this.initial_molfile) {
        this.$emit("editorChanged", true);
      } else {
        this.$emit("editorChanged", false);
      }
    }
  },
  mounted() {
    window.addEventListener(
      "message",
      event => {
        if (event.data.type === "returnMolfile") {
          this.molfile = event.data.molfile;
          let init = this.removeHeader(event.data.molfile);
          if (
            this.data?.attributes?.molfileV3000 &&
            this.initial_molfile === this.blank
          ) {
            // update for search
            this.initial_molfile = init;
          }
          if (init === this.blank) {
            // update if cleared while editing
            this.initial_molfile = init;
          }
        }
      },
      false
    );
  }
};
</script>
