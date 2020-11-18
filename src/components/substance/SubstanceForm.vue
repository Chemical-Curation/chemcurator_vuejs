<template>
  <b-form class="pb-3">
    <div v-for="[field, value] in Object.entries(form)" :key="field">
      <SubstanceFormInput
        :field="field"
        :value="value"
        :payload="payload"
        :validation="validationState[field]"
      />
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
import SubstanceFormInput from "@/components/substance/SubstanceFormInput";
import { mapGetters } from "vuex";

export default {
  name: "SubstanceForm",
  components: {
    SubstanceFormInput
  },
  data() {
    return {
      validationState: this.clearValidation(),
      payload: this.clearPayload()
    };
  },
  computed: {
    ...mapGetters("substance", ["form"]),
    btnDisabled: function() {
      return !Object.keys(this.payload).length > 0;
    }
  },
  watch: {
    "form.id": function() {
      this.payload = this.clearPayload();
    }
  },
  methods: {
    clearForm() {
      this.$store.commit("substance/clearForm");
      this.payload = this.clearPayload();
      this.validationState = this.clearValidation();
    },
    clearPayload() {
      return {};
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
        privateQCNote: { ...clean },
        publicQCNote: { ...clean },
        qcLevel: { ...clean },
        source: { ...clean },
        description: { ...clean },
        substanceType: { ...clean }
      };
    },
    saveSubstance() {
      this.payload["type"] = "substance";
      const { id } = this.form;
      if (id) {
        this.payload["id"] = id;
        // if there is an id, patch the currently loaded substance.
        this.$store
          .dispatch("substance/patch", {
            id: id,
            body: { ...this.payload }
          })
          .then(response => this.handleSuccess(response))
          .catch(err => this.handleFail(err));
      } else {
        // If there is no id, save the new substance.
        this.$store
          .dispatch("substance/post", this.payload)
          .then(response => this.handleSuccess(response))
          .catch(err => this.handleFail(err));
      }
    },
    handleSuccess(response) {
      let action = response.status === 201 ? "created" : "updated";
      let { id } = response.data.data;
      this.clearPayload();
      this.clearValidation();
      console.log(response.data.data);
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
        console.log(error);
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
        this.$set(this.validationState["casrn"], "state", false);
        this.$set(this.validationState["casrn"], "message", "not unique");
      }
    }
  }
};
</script>

<style scoped></style>
