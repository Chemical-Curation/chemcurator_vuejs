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
    <!-- todo: These buttons were made to be a stop-gap for search on update.
      At this point I don't believe they are needed but may contain
      valuable information.  Delete these when update-search is implemented.-->
    <!--    <br />-->
    <!--    <b-button-->
    <!--      variant="secondary"-->
    <!--      v-on:click="exportMrvfile"-->
    <!--      style="width:800px"-->
    <!--      id="marvin-export-button"-->
    <!--    >-->
    <!--      <b-icon-file-arrow-down></b-icon-file-arrow-down>Export-->
    <!--    </b-button>-->
    <!--    <b-form-textarea-->
    <!--      id="marvin-import-textarea"-->
    <!--      v-model="mrvfile"-->
    <!--      rows="3"-->
    <!--      max-rows="6"-->
    <!--      placeholder="Paste mrvfile to import..."-->
    <!--      class="mx-auto mt-5"-->
    <!--      style="width:800px"-->
    <!--    ></b-form-textarea>-->
    <!--    <b-button-->
    <!--      variant="primary"-->
    <!--      v-on:click="importMrvfile"-->
    <!--      class="mt-2"-->
    <!--      style="width:800px"-->
    <!--      id="marvin-import-button"-->
    <!--    >-->
    <!--      <b-icon-file-arrow-up></b-icon-file-arrow-up>Import-->
    <!--    </b-button>-->
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
