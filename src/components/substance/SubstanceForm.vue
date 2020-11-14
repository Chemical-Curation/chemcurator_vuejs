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
      @click="changeThis"
      variant="primary"
      :disabled="btnDisabled"
      >Save Substance</b-button
    >
    <b-button
      @click="changeThat"
      variant="primary"
      :disabled="btnDisabled"
      >Save Substance</b-button
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
        "privateQCNotes": {...clean},
        "publicQCNotes": {...clean},
        "qcLevel": {...clean},
        "source": {...clean},
        "substanceDescription": {...clean},
        "substanceType": {...clean}
      }
    },
    changeThat() {
      this.validationState = this.clearValidation()
    },
    changeThis() {
      this.validationState["qcLevel"].state = false
      this.validationState["qcLevel"].message = "true"
    },
    saveSubstance() {
      this.payload["type"] = "substance";
      const { sid } = this.form;
      if (sid) {
        console.log(sid);
        this.payload["id"] = sid;
        // if there is an id, patch the currently loaded substance.
        this.$store
          .dispatch("substance/patch", {
            id: sid,
            body: { ...this.payload }
          })
          // Handle the errors
          .catch(err => {console.log("patch", err)});
      } else {
        // If there is no id, save the new substance.
        this.$store
          .dispatch("substance/post", this.payload)
          .then(response => {
            console.log(response.data);
            let payload = response.data.data;
            let { id } = payload;
            this.$store.dispatch("substance/loadForm", response.data.data);
            this.$store.dispatch("alert/alert", {
              message: `Substance ${id} created successfully`,
              color: "success",
              dismissCountDown: 5
            });
          })
          // How to deal with errors?
          .catch(err => {
            let ddd = {};
            for (let error of err.response.data.errors) {
              //console.log(error.source.pointer.split("/").slice(-1).shift());
              let attr = error.source.pointer.split("/").slice(-1).shift()
              let jobs = { [`${attr}`] : error.detail }
              ddd = { ...ddd, ...jobs };
              this.$store.commit("substance/formChecked", { key: attr, value: false });
            }
            this.$store.commit("substance/loadErrors", ddd);
            console.log("valids", ddd);
          });
      }
    }
  }
};
</script>

<style scoped></style>
