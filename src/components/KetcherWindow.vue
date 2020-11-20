<template>
  <div>
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

export default {
  name: "KetcherWindow",
  props: {
    initialMolfile: String
  },
  data() {
    return {
      ketcherURL: process.env.VUE_APP_KETCHER_URL,
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
  },
  computed: {
    ...mapState("compound/definedcompound", ["data"]),
    ketcherFrame: function() {
      return this.$refs.ketcher;
    }
  },
  watch: {
    molfile: async function() {
      this.$emit("molfileUpdate", this.molfile)

      // let temp = this.removeHeader(this.molfile);
      // if (temp !== this.initial_molfile) {
      //   this.$store.dispatch("compound/definedcompound/updateChanged", true);
      // } else {
      //   this.$store.dispatch("compound/definedcompound/updateChanged", false);
      // }
    },
    initialMolfile: function() {
      this.molfile = this.initialMolfile
      this.loadMolfile(this.molfile)
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
