<template>
  <div>
    <div class="d-flex">
      <iframe
        id="marvin"
        class="marvin flex-fill"
        data-cy="marvin"
        v-bind:src="marvinURL"
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
      document
        .getElementById("marvin")
        .contentWindow.postMessage(
          { type: "importMrvfile", mrvfile: this.mrvfile },
          "*"
        );
    },
    loadMrvfile: function() {
      document.getElementById("marvin").contentWindow.postMessage(
        {
          type: "importMrvfile",
          mrvfile: this.$store.state.compound.illDefinedCompound.mrvfile
        },
        "*"
      );
      this.exportMrvfile();
    },
    exportMrvfile: function() {
      document
        .getElementById("marvin")
        .contentWindow.postMessage({ type: "exportMrvfile" }, "*");
    }
  },
  computed: {
    compound: function() {
      return this.$store.state.compound.illDefinedCompound.mrvfile;
    }
  },
  watch: {
    compound: function() {
      this.loadMrvfile();
    }
  },
  mounted() {
    let self = this;
    window.addEventListener(
      "message",
      function(event) {
        if (
          event.data === "marvinLoaded" &&
          self.$store.state.compound.illDefinedCompound.mrvfile
        ) {
          self.loadMrvfile();
        }
        if (event.data.type == "returnMrvfile") {
          self.mrvfile = event.data.mrvfile;
          this.mrvfile = self.$store.state.compound.illDefinedCompound.mrvfile;
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
