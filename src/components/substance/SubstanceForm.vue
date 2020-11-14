<template>
  <b-form class="pb-3">
    <div v-for="field in Object.keys(form)" :key="field">
      <SubstanceFormInput
        :field="field"
        :payload="payload"
        :validation="validationState[field]"
      />
    </div>
    <b-button
      @click="saveSubstance"
      variant="primary"
      :disabled="btnDisabled"
      >Save Substance</b-button
    >
    <b-button
      class="ml-2"
      @click="saveSubstance"
      variant="secondary"
      >Clear Form</b-button
    >
  </b-form>
</template>

<script>
import SubstanceFormInput from "@/components/substance/SubstanceFormInput";
import { mapState } from "vuex";

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
    ...mapState("substance", ["form"]),
    btnDisabled: function() {
      return !Object.keys(this.payload).length > 0;
    },
  },
  watch: {
    // let's hope that Chris never wants to edit the `sid` here!
    "form.sid": function() {
      this.payload = this.clearPayload()
    }
  },
  methods: {
    clearPayload() {
      return {}
    },
    clearValidation() {
      let clean = {
          state: null,
          message: ""
      }
      return {
        "sid": {...clean},
        "casrn": {...clean},
        "preferredName": {...clean},
        "privateQCNote": {...clean},
        "publicQCNote": {...clean},
        "qcLevel": {...clean},
        "source": {...clean},
        "description": {...clean},
        "substanceType": {...clean}
      }
    },
    saveSubstance() {
      this.payload["type"] = "substance";
      const { sid } = this.form;
      if (sid) {
        this.payload["id"] = sid;
        // if there is an id, patch the currently loaded substance.
        this.$store
          .dispatch("substance/patch", {
            id: sid,
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
      let action = (response.status === 201) ? "created" : "updated";
      let { id } = response.data.data;
      this.clearPayload();
      this.clearValidation();
      this.$store.dispatch("substance/loadForm", response.data.data);
      this.$store.dispatch("alert/alert", {
        message: `Substance ${id} ${action} successfully`,
        color: "success",
        dismissCountDown: 5
      });
    },
    handleFail(err) {
      let errd = ["sid"];
      for (let error of err.response.data.errors) {
        let attr = error.source.pointer.split("/").slice(-1).shift()
        errd.push(attr);
        this.$set(this.validationState[attr], "state", false);
        this.$set(this.validationState[attr], "message", error.detail);
      }
      // make all fields w/o errors valid
      Object.keys(this.form).filter(k => !errd.includes(k)).forEach(field => {
        this.$set(this.validationState[field], "state", true);
      })
    }
  }
};
</script>

<style scoped></style>
