<template>
  <div>
    <div class="row mb-3">
      <b-form-group
        label="Record Compound ID:"
        label-align="left"
        label-cols="4"
        label-for="recordCompoundID"
        class="col"
      >
        <b-form-input id="recordCompoundID" :value="cid" disabled />
        <template v-if="showSubstanceLink">
          <router-link
            id="substanceLink"
            :to="{ name: 'substance_detail', params: { sid: sid } }"
            target="_blank"
            title="Open substance associated with this compound in a new tab"
          >
            <b-icon icon="link" />
            {{ sid }}
          </router-link>
        </template>
      </b-form-group>
      <b-form-group
        label="Structure Type:"
        label-align="left"
        label-cols="4"
        label-for="compound-type-dropdown"
        class="col"
      >
        <b-form-select
          id="compound-type-dropdown"
          v-model="type"
          :options="options(type)"
        >
          <template #first>
            <option value="none">None</option>
            <option value="definedCompound">Defined Compound</option>
          </template>
        </b-form-select>
      </b-form-group>
    </div>
    <div v-show="type === 'definedCompound'">
      <div id="substanceInfoPanel" class="border rounded mb-3">
        <dl class="row my-1 p-2">
          <dt class="col-lg-2">Molecular Weight</dt>
          <dd class="col-lg-4 overflow-auto">
            {{ molecularWeight }}
          </dd>

          <dt class="col-lg-2">Molecular Formula</dt>
          <dd class="col-lg-4 overflow-auto">
            {{ molecularFormula }}
          </dd>

          <dt class="col-lg-2">SMILES</dt>
          <dd class="col-lg-4 overflow-auto">
            {{ smiles }}
          </dd>

          <dt class="col-lg-2">Inchikey</dt>
          <dd class="col-lg-4 overflow-auto">
            {{ inchikey }}
          </dd>
        </dl>
      </div>
      <KetcherWindow
        ref="ketcher"
        :initial-molfile="initialMolfile"
        :urlParam="urlParam"
        @molfileUpdate="ketcherChanged = $event.changed"
      />
    </div>
    <div v-show="type !== 'definedCompound' && type !== 'none'">
      <MarvinWindow
        :initial-mrvfile="initialMrvfile"
        ref="marvin"
        @mrvfileUpdate="marvinChanged = $event.changed"
      />
    </div>
    <div class="my-3">
      <b-button
        @click="saveCompound(type)"
        variant="primary"
        :disabled="!editorChanged"
        v-if="editable && type !== 'none'"
        >Save Compound</b-button
      >
    </div>
  </div>
</template>

<script>
import KetcherWindow from "@/components/KetcherWindow";
import MarvinWindow from "@/components/MarvinWindow";
import { mapGetters } from "vuex";

export default {
  name: "ChemicalEditors",
  components: {
    KetcherWindow,
    MarvinWindow
  },
  props: {
    initialCompound: Object,
    editable: Boolean,
    substance: Object,
    urlParam: Boolean
  },
  data() {
    return {
      ketcherChanged: false,
      marvinChanged: false
    };
  },
  watch: {
    initialCompound: function() {
      if (this.type === "none" && !this.substance.id) {
        // this block empties out the ketcher window when substance is
        // hit in the NavBar
        this.$refs["ketcher"].clearMolfile();
        this.changed = false;
      } else if (
        this.initialCompound?.type === "definedCompound" &&
        this.urlParam &&
        this.$store.state.compound.definedcompound.loadable
      ) {
        this.$refs["ketcher"].loadMolfile(this.initialMolfile, true);
        this.$store.commit("compound/definedcompound/setLoadable", false);
      } else {
        this.$refs["marvin"].loadMrvfile(this.initialMrvfile);
      }
    },
    editorChanged: function() {
      this.$emit("change", this.editorChanged);
    }
  },
  computed: {
    ...mapGetters("queryStructureType", { options: "getOptions" }),
    type: {
      get: function() {
        return this.$store.state.compound.type;
      },
      set: function(newValue) {
        this.$store.commit("compound/setType", newValue);
      }
    },
    initialMolfile: function() {
      return this.initialCompound?.attributes?.molfileV3000 ?? "";
    },
    initialMrvfile: function() {
      return this.initialCompound?.attributes?.mrvfile ?? "<MDocument/>";
    },
    molecularWeight: function() {
      return this.initialCompound?.attributes?.molecularWeight ?? "-";
    },
    molecularFormula: function() {
      return this.initialCompound?.attributes?.molecularFormula ?? "-";
    },
    smiles: function() {
      return this.initialCompound?.attributes?.smiles ?? "-";
    },
    inchikey: function() {
      return this.initialCompound?.attributes?.inchikey ?? "-";
    },
    cid: function() {
      return this.initialCompound?.id;
    },
    sid: function() {
      // the sid that the loaded compound is related to
      if (this.cid) {
        return this.initialCompound?.relationships?.substance?.data?.id || "";
      } else {
        return null;
      }
    },
    editorChanged: function() {
      if (this.initialCompound?.type === "illDefinedCompound") {
        if (
          this.initialCompound.id &&
          this.type !==
            this.initialCompound?.relationships?.queryStructureType.data.id
        ) {
          return true;
        } else return this.marvinChanged;
      } else return this.ketcherChanged;
    },
    showSubstanceLink: function() {
      return this.sid && this.sid !== this.substance?.id;
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
      // replace is used to escape "\" so that the JSON is parsable
      let requestBody = {
        type: "definedCompound",
        attributes: {
          molfileV3000: this.$refs["ketcher"].molfile.replace(/\\/g, "\\\\")
        }
      };
      if (this.cid) {
        // if there is an id, patch the currently loaded defined compound.
        this.$store
          .dispatch("compound/definedcompound/patch", {
            id: this.cid,
            body: { ...requestBody, id: this.cid }
          })
          .then(() => (this.ketcherChanged = false))
          .catch(err => this.handleError(err));
      } else {
        // If there is no id, save the new compound
        this.$store
          .dispatch("compound/definedcompound/post", requestBody)
          .then(response => {
            this.$store.dispatch(
              "compound/definedcompound/getFetch",
              response.data.data.id
            );
            this.ketcherChanged = false;
          })
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
          .then(response => {
            this.$store.commit(
              "compound/illdefinedcompound/storeFetch",
              response.data.data
            );
            this.marvinChanged = false;
          })
          .catch(err => this.handleError(err));
      } else {
        // If there is no id, save the new compound
        this.$store
          .dispatch("compound/illdefinedcompound/post", requestBody)
          .then(response => {
            // Load the newly created compound.  We could bypass this action by
            // storing the response but this verifies the compound is the same and
            // further searches will work
            this.$store.dispatch("compound/fetchCompound", {
              id: response.data.data.id
            });
            this.marvinChanged = false;
          })
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
