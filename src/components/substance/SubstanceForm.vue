<template>
  <b-form class="pb-3">
    <div v-for="field in Object.keys(form)" :key="field">
      <b-form-group
        :label="labels[field]"
        label-align="left"
        label-cols="3"
        :label-for="field"
        class="pb-3"
        :class="field"
      >
        <template v-if="dropdowns.includes(field)">
          <b-form-select
            :id="field"
            v-model="form[field]"
            :state="validationState[field].state"
            :options="options[field]"
            :disabled="!isAuthenticated"
            @change="markChanged"
          />
        </template>
        <template v-else-if="textareas.includes(field)">
          <b-form-textarea
            :id="field"
            v-model="form[field]"
            :state="validationState[field].state"
            :disabled="!isAuthenticated"
            @input="markChanged"
          />
        </template>
        <template v-else>
          <b-form-input
            :id="field"
            v-model="form[field]"
            :state="validationState[field].state"
            :disabled="editable(field)"
            @input="markChanged"
          />
        </template>
        <b-form-invalid-feedback :id="'feedback-' + field">
          {{ validationState[field].message }}
        </b-form-invalid-feedback>
      </b-form-group>
    </div>
    <b-button
      id="save-substance-btn"
      @click="saveSubstance"
      variant="primary"
      :disabled="btnDisabled"
      >Save Substance</b-button
    >
    <b-button class="ml-2" @click="clearForm" variant="secondary"
      >Clear Form</b-button
    >
  </b-form>
</template>

<script>
export default {
  name: "SubstanceForm",
  props: [
    "substance",
    "compound",
    "isAuthenticated",
    "qcLevelOptions",
    "sourceOptions",
    "substanceTypeOptions"
  ],
  data() {
    return {
      formChanged: 0,
      validationState: this.clearValidation(),
      textareas: ["description", "privateQcNote", "publicQcNote"],
      dropdowns: ["qcLevel", "source", "substanceType"],
      labels: {
        id: "Substance ID:",
        preferredName: "Preferred Name:",
        displayName: "Display Name:",
        casrn: "CAS-RN:",
        description: "Substance Description:",
        privateQcNote: "Private QC Notes:",
        publicQcNote: "Public QC Notes:",
        qcLevel: "QC Level:",
        source: "Source:",
        substanceType: "Substance Type:"
      }
    };
  },
  computed: {
    compoundChanged: function() {
      if (
        this.$store.state.compound.type == "none" &&
        Boolean(this.substance.relationships.associatedCompound.data)
      ) {
        return true;
      } else if (
        this.$store.state.compound.type == "none" &&
        !this.substance.relationships.associatedCompound.data
      ) {
        return false;
      } else if (
        this.compound.id &&
        this.compound.id !==
          this.substance.relationships.associatedCompound?.data?.id
      ) {
        return true;
      } else {
        return false;
      }
    },
    btnDisabled: function() {
      if (this.compoundChanged) {
        return false;
      } else return this.formChanged === 0;
    },
    options: function() {
      return {
        qcLevel: this.qcLevelOptions(
          this.substance?.relationships?.qcLevel?.data?.id
        ),
        source: this.sourceOptions(
          this.substance?.relationships?.source?.data?.id
        ),
        substanceType: this.substanceTypeOptions(
          this.substance?.relationships?.substanceType?.data?.id
        )
      };
    },
    form: function() {
      let { attributes, relationships } = this.substance;
      return {
        id: this.substance.id, // sid
        preferredName: attributes.preferredName,
        displayName: attributes.displayName,
        casrn: attributes.casrn,
        qcLevel: relationships.qcLevel.data.id,
        source: relationships.source.data.id,
        substanceType: relationships.substanceType.data.id,
        description: attributes.description,
        privateQcNote: attributes.privateQcNote,
        publicQcNote: attributes.publicQcNote
      };
    }
  },
  watch: {
    //    "substance.id": function() {
    //      this.validationState = this.clearValidation();
    //      this.formChanged = 0;
    //    }
  },
  methods: {
    editable(fld) {
      return fld === "id" ? true : !this.isAuthenticated;
    },
    markChanged() {
      this.formChanged++;
    },
    clearForm() {
      this.$store.commit("substance/clearForm");
      this.validationState = this.clearValidation();
      this.formChanged = 0;
    },
    clearValidation() {
      let clean = {
        state: null,
        message: ""
      };
      return {
        id: { ...clean },
        casrn: { ...clean },
        preferredName: { ...clean },
        displayName: { ...clean },
        privateQcNote: { ...clean },
        publicQcNote: { ...clean },
        qcLevel: { ...clean },
        source: { ...clean },
        description: { ...clean },
        substanceType: { ...clean }
      };
    },
    buildPayload() {
      let { id } = this.form;
      let data = { ...this.form };
      // create attributes object
      let pickAttributes = (...props) => o =>
        props.reduce((a, e) => ({ ...a, [e]: o[e] }), {});
      let attrs = pickAttributes(
        "preferredName",
        "displayName",
        "casrn",
        "description",
        "publicQcNote",
        "privateQcNote"
      )(data);
      // filter out attributes that have not been changed
      if (id) {
        let { attributes } = this.substance;
        Object.keys(attrs).forEach(key => {
          if (attrs[key] === attributes[key]) delete attrs[key];
        });
      } else {
        Object.keys(attrs).forEach(key => {
          if (attrs[key] == null) delete attrs[key];
        });
      }
      // create relationship object
      let pickRelationships = (...props) => o =>
        props.reduce(
          (a, e) => ({ ...a, [e]: { data: { type: e, id: o[e] } } }),
          {}
        );
      let related = pickRelationships(
        "qcLevel",
        "source",
        "substanceType"
      )(data);
      // filter out the relationships that haven't been changed
      let { relationships } = this.substance;
      if (id) {
        Object.keys(related).forEach(key => {
          if (related[key].data.id == relationships[key].data.id)
            delete related[key];
        });
      } else {
        Object.keys(related).forEach(key => {
          if (related[key].data.id == null) delete related[key];
        });
      }
      if (this.compound.id) {
        related["associatedCompound"] = {
          data: {
            id: this.compound.id,
            type: this.compound.type
          }
        };
      } else {
        related["associatedCompound"] = { data: null };
      }
      let payload = {
        type: "substance",
        attributes: attrs,
        relationships: related
      };
      return payload;
    },
    saveSubstance() {
      let { id } = this.form;
      let payload = this.buildPayload();
      if (id) {
        console.log("patch", this.$store.state.compound.type);
        console.log("patch", payload);
        payload["id"] = id;
        // if there is an id, patch the currently loaded substance.
        this.$store
          .dispatch("substance/patch", {
            id: id,
            body: { ...payload }
          })
          .then(response => this.handleSuccess(response))
          .catch(err => this.handleFail(err));
      } else {
        console.log("post", payload);
        // If there is no id, save the new substance.
        this.$store
          .dispatch("substance/post", payload)
          .then(response => this.handleSuccess(response))
          .catch(err => this.handleFail(err));
      }
    },
    handleSuccess(response) {
      let action = response.status === 201 ? "created" : "updated";
      let { id } = response.data.data;
      this.validationState = this.clearValidation();
      this.formChanged = 0;
      this.$store.commit("substance/loadDetail", response.data.data);
      // update for the tree
      this.$store.dispatch("substance/getList");
      this.$store.dispatch("alert/alert", {
        message: `Substance '${id}' ${action} successfully`,
        color: "success",
        dismissCountDown: 5
      });
    },
    handleFail(err) {
      // `sid` is included here to prevent it's input state from going true
      let errd = ["id"];
      let nonField = [];
      for (let error of err.response.data.errors) {
        let attr = error.source.pointer
          .split("/")
          .slice(-1)
          .shift();
        if (attr == "nonFieldErrors") {
          nonField.push(error.detail);
        } else {
          errd.push(attr);
          this.$set(this.validationState[attr], "state", false);
          this.$set(this.validationState[attr], "message", error.detail);
        }
      }
      // make all fields w/o errors valid
      Object.keys(this.form)
        .filter(k => !errd.includes(k))
        .forEach(field => {
          this.$set(this.validationState[field], "state", true);
        });
      // handle nonField errors
      if (nonField.length > 0) {
        this.$store.dispatch("alert/alert", {
          message: nonField.shift(),
          color: "warning",
          dismissCountDown: 5
        });
        // hard-coding this for now as we might need to make some adjustments
        // to the API to get these fields in the response in a cleaner way
        // I think this is the only nonField Error that we have for the moment
        this.$set(this.validationState["preferredName"], "state", false);
        this.$set(
          this.validationState["preferredName"],
          "message",
          "not unique"
        );
        this.$set(this.validationState["displayName"], "state", false);
        this.$set(this.validationState["displayName"], "message", "not unique");
        this.$set(this.validationState["casrn"], "state", false);
        this.$set(this.validationState["casrn"], "message", "not unique");
      }
    }
  }
};
</script>

<style scoped></style>
