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
  props:{
    initialMrvfile: String
  },
  data() {
    return {
      marvinURL: process.env.VUE_APP_MARVIN_URL + "/editorws.html",
      localMrvfile: "",
    };
  },
  methods: {
    loadMrvfile: function(mrvfile) {
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
        // if (
        //   this.initialMrvfile === "<MDocument/>" &&
        //   this.data?.attributes?.mrvfile
        // ) {
        //   this.initialMrvfile = this.removeTags(event.data.mrvfile);
        // }
        // this.updateLocalMrvfile(event.data.mrvfile);
      }
    },
    // updateLocalMrvfile: function(mrvfile) {
    //   // Save the external mrvfile to the local vue instance
    //   this.localMrvfile = mrvfile;
    //   let strippedMrv = this.removeTags(mrvfile);
    //   if (strippedMrv === this.initialMrvfile)
    //     this.$store.dispatch(
    //       "compound/illdefinedcompound/updateChanged",
    //       false
    //     );
    //   else
    //     this.$store.dispatch("compound/illdefinedcompound/updateChanged", true);
    // },
    // removeTags: function(str) {
    //   let serializer = new XMLSerializer();
    //   let tree = new window.DOMParser().parseFromString(str, "text/xml");
    //   let node = tree.getElementsByTagName("MDocument")[0];
    //   return serializer.serializeToString(node);
    // }
  },
  computed: {
    // ...mapState("compound/illdefinedcompound", ["data"]),
    marvinFrame: function() {
      return this.$refs.marvin;
    }
  },
  watch: {
    initialMrvfile: function() {
      this.localMrvfile = this.initialMrvfile
      console.log(this.localMrvfile)
      if (this.localMrvfile)
        this.loadMrvfile(this.localMrvfile)
    }
  },
  mounted() {
    // window.addEventListener("message", this.marvinMessageListeners, false);
  },
  destroyed() {
    // window.removeEventListener("message", this.marvinMessageListeners);
  }
};
</script>

<style scoped>
#marvin {
  overflow: hidden;
  height: 600px;
}
</style>
