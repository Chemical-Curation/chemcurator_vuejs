<template>
  <div>
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
    ...mapState("compound/definedcompound", ["data", "blank"]),
    ketcherFrame: function() {
      return this.$refs.ketcher;
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
        this.$emit("molfileChanged", true);
      } else {
        this.$emit("molfileChanged", false);
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
