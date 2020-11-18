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
        @load="loadMolfile(molfile)"
        height="600"
        ref="ketcher"
        >ketcher</iframe
      >
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import compoundApi from "@/api/compound";

export default {
  name: "KetcherWindow",
  data() {
    return {
      ketcherURL: process.env.VUE_APP_KETCHER_URL,
      initial_molfile:
        "  0  0  0     0  0            999 V3000\n" +
        "M  V30 BEGIN CTAB\n" +
        "M  V30 COUNTS 0 0 0 0 0\n" +
        "M  V30 BEGIN ATOM\n" +
        "M  V30 END ATOM\n" +
        "M  V30 BEGIN BOND\n" +
        "M  V30 END BOND\n" +
        "M  V30 END CTAB\n" +
        "M  END",
      blank:
        "  0  0  0     0  0            999 V3000\n" +
        "M  V30 BEGIN CTAB\n" +
        "M  V30 COUNTS 0 0 0 0 0\n" +
        "M  V30 BEGIN ATOM\n" +
        "M  V30 END ATOM\n" +
        "M  V30 BEGIN BOND\n" +
        "M  V30 END BOND\n" +
        "M  V30 END CTAB\n" +
        "M  END",
      molfile: "",
      compound: {}
    };
  },
  methods: {
    ...mapActions("compound/definedcompound", ["fetchByMolfile"]),
    loadMolfile: function(molfile) {
      if (molfile) {
        this.ketcherFrame.contentWindow.postMessage(
          {
            type: "importMolfile",
            molfile: molfile
          },
          "*"
        );
        this.exportMolfile();
      } else this.clearMolfile();
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
    },
    loadCompound: async function(id) {
      this.compound = await compoundApi.fetchCompound(id)
      this.loadMolfile(this.compound?.data?.attributes?.molfileV3000)
    }
  },
  computed: {
    ...mapState("compound/definedcompound", ["data"]),
    ketcherFrame: function() {
      return this.$refs.ketcher;
    },
    molecularWeight: function() {
      return this.compound?.data?.attributes?.molecularWeight ?? "-";
    },
    molecularFormula: function() {
      return this.compound?.data?.attributes?.molecularFormula ?? "-";
    },
    smiles: function() {
      return this.compound?.data?.attributes?.smiles ?? "-";
    },
    inchikey: function() {
      return this.compound?.data?.attributes?.inchikey ?? "-";
    }
  },
  watch: {
    molfile: async function() {
      this.compound = await compoundApi.fetchByMolfile(this.molfile);
      this.$emit("compoundUpdate", this.compound?.data?.id ?? "")

      let temp = this.removeHeader(this.molfile);
      if (temp !== this.initial_molfile) {
        this.$store.dispatch("compound/definedcompound/updateChanged", true);
      } else {
        this.$store.dispatch("compound/definedcompound/updateChanged", false);
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
