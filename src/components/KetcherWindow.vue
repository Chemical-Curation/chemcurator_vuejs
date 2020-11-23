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
import { mapState } from "vuex";

export default {
  name: "KetcherWindow",
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
      loadedMolfile: ""
    };
  },
  methods: {
    loadMolfile: function(molfile) {
      if (molfile) {
        this.loadedMolfile = "";

        this.ketcherFrame.contentWindow.postMessage(
          {
            type: "importMolfile",
            molfile: molfile
          },
          "*"
        );
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
    }
  },
  computed: {
    ...mapState("compound/definedcompound", ["data"]),
    ketcherFrame: function() {
      return this.$refs.ketcher;
    },
    molfileChanged: function() {
      return (
        this.removeHeader(this.molfile) !==
          this.removeHeader(this.loadedMolfile) &&
        this.removeHeader(this.molfile) !== this.blank
      );
    }
  },
  watch: {
    molfile: function() {
      this.$emit("molfileUpdate", {
        molfileV3000: this.molfile,
        changed: this.molfileChanged
      });
    }
  },
  mounted() {
    window.addEventListener(
      "message",
      event => {
        if (event.data.type === "returnMolfile") {
          if (!this.loadedMolfile) this.loadedMolfile = event.data.molfile;
          this.molfile = event.data.molfile;
        }
      },
      false
    );
  }
};
</script>
