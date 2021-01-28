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
// import { mapState } from "vuex";

export default {
  name: "MarvinWindow",
  props: {
    initialMrvfile: String
  },
  data() {
    return {
      marvinURL: process.env.VUE_APP_MARVIN_URL + "/editorws.html",
      localMrvfile: "",
      blankMrvfile: "<MDocument/>",
      loadedMrvfile: "<MDocument/>"
    };
  },
  methods: {
    resetMarvin: function() {
      this.marvinFrame.contentWindow.postMessage(
        {
          type: "importMrvfile",
          mrvfile: this.loadedMrvfile
        },
        "*"
      );
    },
    loadMrvfile: function(mrvfile) {
      this.loadedMrvfile = "";
      this.marvinFrame.contentWindow.postMessage(
        {
          type: "importMrvfile",
          mrvfile: mrvfile
        },
        "*"
      );
    },
    exportMrvfile: function() {
      this.marvinFrame.contentWindow.postMessage(
        { type: "exportMrvfile" },
        "*"
      );
    },
    clearMarvin: function() {
      this.marvinFrame.contentWindow.postMessage({ type: "clearMrvfile" }, "*");
    },
    marvinMessageListeners: function(event) {
      if (event.data.type === "returnMrvfile") {
        if (!this.loadedMrvfile) {
          this.loadedMrvfile = event.data.mrvfile;
        }
        this.localMrvfile = event.data.mrvfile;
      }
      if (event.data === "marvinLoaded") {
        this.loadMrvfile(this.initialMrvfile);
      }
    },
    removeTags: function(str) {
      let serializer = new XMLSerializer();
      let tree = new window.DOMParser().parseFromString(str, "text/xml");
      let node = tree.getElementsByTagName("MDocument")[0];
      return serializer.serializeToString(node);
    }
  },
  watch: {
    localMrvfile: function() {
      // Save the external mrvfile to the local vue instance
      this.$emit("mrvfileUpdate", {
        mrvfile: this.localMrvfile,
        changed: this.mrvfileChanged
      });
    }
  },
  computed: {
    marvinFrame: function() {
      return this.$refs.marvin;
    },
    mrvfileChanged: function() {
      return (
        this.removeTags(this.localMrvfile) !==
          this.removeTags(this.loadedMrvfile) &&
        this.removeTags(this.localMrvfile) !== this.blankMrvfile
      );
    }
  },
  beforeMount() {
    window.addEventListener("message", this.marvinMessageListeners, false);
  },
  destroyed() {
    window.removeEventListener("message", this.marvinMessageListeners);
  }
};
</script>

<style scoped>
#marvin {
  overflow: hidden;
  height: 600px;
}
</style>
