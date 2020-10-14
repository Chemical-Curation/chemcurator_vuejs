<template>
  <div>
    <div v-show="type === 'definedCompound'">
      <KetcherWindow ref="ketcher" />
    </div>
    <div v-show="type !== 'definedCompound'">
      <MarvinWindow ref="marvin" />
    </div>
    <div class="my-3">
      <b-button
        @click="saveCompound(type)"
        variant="primary"
        :disabled="!editorChanged"
        v-if="editable"
        >Save Compound</b-button
      >
    </div>
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
    type: String,
    editable: Boolean
  },
  computed: {
    editorChanged: function() {
      if (
        (this.$store.state.compound.illdefinedcompound.changed &&
          this.type !== "definedCompound") ||
        (this.$store.state.compound.definedcompound.changed &&
          this.type === "definedCompound")
      ) {
        return true;
      } else {
        return false;
      }
    }
  },
  methods: {
    saveCompound(type) {
      if (type === "definedCompound") {
        this.saveDefinedCompound();
      } else {
        this.saveIllDefinedCompound();
      }
    },
    saveDefinedCompound() {
      let compoundId = this.$store.state.compound.definedcompound.data.id;
      // replace is used to escape "\" so that the JSON is parsable
      let requestBody = {
        type: "definedCompound",
        attributes: {
          molfileV2000: this.$refs["ketcher"].molfile.replace(/\\/g, "\\\\")
        }
      };
      if (compoundId) {
        // if there is an id, patch the currently loaded defined compound.
        this.$store
          .dispatch("compound/definedcompound/patch", {
            id: compoundId,
            body: { ...requestBody, id: compoundId }
          })
          // Handle the errors
          .catch(err => this.handleError(err));
      } else {
        // If there is no id, save the new compound
        this.$store
          .dispatch("compound/definedcompound/post", requestBody)
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
    saveIllDefinedCompound() {
      let compoundId = this.$store.state.compound.illdefinedcompound.data.id;
      // Generic pot body
      let requestBody = {
        type: "illDefinedCompound",
        attributes: {
          mrvfile: this.$refs["marvin"].localMrvfile
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
