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
      localMrvfile: ""
    };
  },
  methods: {
    importMrvfile: function() {
      this.marvinFrame.contentWindow.postMessage(
        { type: "importMrvfile", mrvfile: this.localMrvfile },
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
      if (event.data === "marvinLoaded" && this.data?.attributes?.mrvfile) {
        this.loadMrvfile();
      }
      if (event.data.type === "returnMrvfile") {
        this.updateLocalMrvfile(event.data.mrvfile);
      }
    },
    updateLocalMrvfile: function(mrvfile) {
      // Save the external mrvfile to the local vue instance
      this.localMrvfile = mrvfile;

      // If the mrvfile is blank (as Marvin returns it)
      // Todo: handle loaded but unchanged
      if (this.localMrvfile === "<cml><MDocument></MDocument></cml>")
        // Emit that there was no change
        this.$emit("mrvfileChanged", false);
      else this.$emit("mrvfileChanged", true); // Else emit that there was a change
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
