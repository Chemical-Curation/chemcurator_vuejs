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
    <!--    <b-form-textarea-->
    <!--      id="ketcher-import-textarea"-->
    <!--      v-model="molfile"-->
    <!--      rows="3"-->
    <!--      max-rows="6"-->
    <!--      placeholder="Edit the above window to generate a Molfile..."-->
    <!--      class="mx-auto mt-5"-->
    <!--      style="width:800px"-->
    <!--      disabled-->
    <!--    ></b-form-textarea>-->
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "KetcherWindow",
  data() {
    return {
      ketcherURL: process.env.VUE_APP_KETCHER_URL,
      molfile: ""
    };
  },
  methods: {
    loadMolfile: function() {
      if (this.attributes.molfileV3000) {
        this.ketcherFrame.contentWindow.postMessage(
          {
            type: "importMolfile",
            molfile: this.attributes.molfileV3000
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
    ...mapState("compound/definedcompound", ["attributes"]),
    ketcherFrame: function() {
      return this.$refs.ketcher;
    }
  },
  watch: {
    attributes: function() {
      if (this.attributes.molfileV3000) {
        this.loadMolfile();
      } else {
        this.clearMolfile();
      }
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
