<template>
  <div>
    <div class="d-flex">
      <iframe
        id="ketcher"
        class="ketcher flex-fill"
        data-cy="ketcher"
        :src="ketcherURL"
        @load="loadMolfile(compound.attributes.molfileV3000)"
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
  props: {
    compound: Object
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
      molfile: ""
    };
  },
  methods: {
    loadMolfile: function(molfile) {
      if (molfile) {
        console.log("loading...", molfile);
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
      console.log("clearing...");
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
    ...mapState("compound/definedcompound", ["data"]),
    ketcherFrame: function() {
      return this.$refs.ketcher;
    },
    molfileChanged: function() {
      if (this.compound.id) {
        return false;
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
          this.molfile = event.data.molfile;
        }
      },
      false
    );
  }
};
</script>
