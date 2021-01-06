<template>
  <div>
    <div class="d-flex">
      <iframe
        id="ketcher"
        class="ketcher flex-fill"
        data-cy="ketcher"
        :src="ketcherURL"
        @load="loadMolfile(initialMolfile)"
        height="600"
        ref="ketcher"
        >ketcher</iframe
      >
    </div>
  </div>
</template>

<script>
export default {
  name: "KetcherWindow",
  props: {
    initialMolfile: String,
    urlParam: Boolean
  },
  data() {
    return {
      ketcherURL: process.env.VUE_APP_KETCHER_URL,
      blank:
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
      this.$emit("molfileUpdate", {
        changed: this.molfileChanged
      });
    },
    removeHeader: function(str) {
      // the header returned in the molfile changes on every refresh, but
      // doesn't represent the compound data that the molfile contains. It can
      // also differ then from what is drawn in comparison to what is stored.
      return str
        .split("\n")
        .slice(4, -1)
        .join("\n");
    }
  },
  computed: {
    ketcherFrame: function() {
      return this.$refs.ketcher;
    },
    molfileChanged: function() {
      if (this.urlParam) {
        return (
          this.removeHeader(this.loadedMolfile) !==
          this.removeHeader(this.molfile)
        );
      } else {
        return this.blank !== this.removeHeader(this.molfile);
      }
    }
  },
  watch: {
    molfileChanged: function() {
      this.$emit("molfileUpdate", {
        changed: this.molfileChanged
      });
    },
    molfile: function() {
      this.$store.dispatch(
        "compound/definedcompound/fetchByMolfile",
        this.molfile
      );
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
