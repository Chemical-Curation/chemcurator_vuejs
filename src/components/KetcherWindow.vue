<template>
  <div>
    <div class="border rounded mb-3">
      <dl class="row my-1 p-2">
        <dt class="col-2">Molecular Weight</dt>
        <dd class="col-4">{{ molecularWeight }}</dd>

        <dt class="col-2">Molecular Formula</dt>
        <dd class="col-4">{{ molecularFormula }}</dd>

        <dt class="col-2">SMILEs</dt>
        <dd class="col-4">{{ smiles }}</dd>

        <dt class="col-2">Inchikey</dt>
        <dd class="col-4">{{ inchikey }}</dd>
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
    }
  },
  mounted() {
    window.addEventListener(
      "message",
      event => {
        if (event.data.type === "returnMolfile") {
          this.molfile = event.data.molfile;
        }
      },
      false
    );
  }
};
</script>
