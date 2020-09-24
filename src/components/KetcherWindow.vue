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
