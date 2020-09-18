<template>
  <div>
    <div class="d-flex">
      <iframe
        id="marvin"
        class="marvin flex-fill"
        data-cy="marvin"
        v-bind:src="marvinURL"
        ref="marvin"
      >
        marvin
      </iframe>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "MarvinWindow",
  data() {
    return {
      marvinURL: process.env.VUE_APP_MARVIN_URL + "/editorws.html",
      mrvfile: ""
    };
  },
  methods: {
    importMrvfile: function() {
      this.marvinFrame.contentWindow.postMessage(
        { type: "importMrvfile", mrvfile: this.mrvfile },
        "*"
      );
    },
    loadMrvfile: function() {
      this.marvinFrame.contentWindow.postMessage(
        {
          type: "importMrvfile",
          mrvfile: this.data.attributes.mrvfile
        },
        "*"
      );
      this.exportMrvfile();
    },
    exportMrvfile: function() {
      this.marvinFrame.contentWindow.postMessage(
        { type: "exportMrvfile" },
        "*"
      );
    },
    clearMarvin: function() {
      this.marvinFrame.contentWindow.postMessage({ type: "clearMrvfile" }, "*");
    }
  },
  computed: {
    ...mapState("compound/illdefinedcompound", ["data"]),
    marvinFrame: function() {
      return this.$refs.marvin;
    }
  },
  watch: {
    data: function() {
      if (this.data?.attributes?.mrvfile) {
        this.loadMrvfile();
      } else {
        this.clearMarvin();
      }
    }
  },
  mounted() {
    // let self = this;
    window.addEventListener(
      "message",
      event => {
        if (event.data === "marvinLoaded" && this.data?.attributes?.mrvfile) {
          this.loadMrvfile();
        } else {
          this.exportMrvfile();
        }
        if (event.data.type === "returnMrvfile") {
          this.mrvfile = event.data.mrvfile;
        }
      },
      false
    );
  }
};
</script>

<style scoped>
#marvin {
  overflow: hidden;
  height: 600px;
}
</style>
