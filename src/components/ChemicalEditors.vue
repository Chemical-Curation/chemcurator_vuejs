<template>
  <div>
    <b-form>
      <KetcherWindow v-show="type === 'definedCompound'" ref="ketcher " />
      <MarvinWindow v-show="type !== 'definedCompound'" ref="marvin" />
      <div class="my-3">
        <b-button @click="save" variant="primary">Save Compound</b-button>
      </div>
    </b-form>
  </div>
</template>

<script>
import KetcherWindow from "@/components/KetcherWindow";
import MarvinWindow from "@/components/MarvinWindow";

export default {
  name: "ChemicalEditors",
  components: {
    KetcherWindow,
    MarvinWindow
  },
  props: {
    type: String
  },
  methods: {
    save: function() {
      // Determine which editor is being saved.
      if (this.type === "definedCompound") {
        //todo: this needs to be implemented
      } else {
        this.saveIllDefinedCompound();
      }
    },
    saveIllDefinedCompound() {
      let compoundId = this.$store.state.compound.illdefinedcompound.data.id;
      // Generic pot body
      let requestBody = {
        type: "illDefinedCompound",
        attributes: {
          mrvfile: this.$refs["marvin"].mrvfile
        },
        relationships: {
          queryStructureType: {
            data: {
              id: this.type,
              type: "queryStructureType"
            }
          }
        }
      };
      if (compoundId) {
        // if there is an id, patch the currently loaded ill-defined compound.
        this.$store
          .dispatch("compound/illdefinedcompound/patch", {
            id: compoundId,
            body: { ...requestBody, id: compoundId }
          })
          // Handle the errors
          .catch(err => this.handleError(err));
      } else {
        // If there is no id, save the new compound
        this.$store
          .dispatch("compound/illdefinedcompound/post", requestBody)
          .then(response =>
            // Load the newly created compound.  We could bypass this action by
            // storing the response but this verifies the compound is the same and
            // further searches will work
            this.$store.dispatch("compound/fetchCompound", {
              searchString: response.data.data.attributes.cid
            })
          )
          // Handle the errors
          .catch(err => this.handleError(err));
      }
    },
    handleError: function(err) {
      // Currently alert only can store a single alert.
      // Only the last alert will be presented.
      for (let error of err.response.data.errors) {
        this.$store.dispatch("alert/alert", {
          message: error.detail,
          color: "danger",
          dismissCountDown: 15
        });
      }
    }
  }
};
</script>

<style scoped>
.editor {
  width: 800px;
  margin: auto;
}
</style>
