<template>
  <b-form class="pb-3">
    <div v-for="(formKey, index) in Object.keys(form)" :key="index">
      <SubstanceFormInput
        :val="formKey"
        :form=form
      />
    </div>
    <b-button
      @click="saveSubstance(type)"
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
  props: {
    // Type compound being displayed. Important for knowing which store to fetch from.
    type: String
  },
  computed: {
    ...mapState("substance", ["form", "btnDisabled"]),
  },
  methods: {
    saveSubstance() {
      const substanceForm = this.$store.state.substance.savedData;
      const { sid } = substanceForm ;
      console.log(sid);

      if (sid) {
        // if there is an id, patch the currently loaded substance.
        this.$store
          .dispatch("substance/patch", {
            id: sid,
            body: { ...substanceForm }
          })
          // Handle the errors
          .catch(err => this.handleError(err));
      } else {
        // If there is no id, save the new substance.
        this.$store
          .dispatch("substance/post", substanceForm)
          .then(response => {
            console.log(response);
          })
          // How to deal with errors?
          .catch(err => {
            let catcher = [];
            for (let error of err.response.data.errors) {
              console.log(error.source.pointer.split("/").slice(-1).shift());
              let gert = error.source.pointer.split("/").slice(-1).shift()
              catcher.push(gert);
              console.log(error.detail);
              this.$store.commit("substance/loadErrors", { key: gert, value: error.detail });
              this.$store.commit("substance/formChecked", { key: gert, value: false });
            }
            let valids = Object.keys(this.form).filter(key => !catcher.includes(key));
            console.log("valids", valids);
            for (let valid of valids) {
              this.$store.commit("substance/formChecked", { key: valid, value: true });
            }
          });
      }
    }
  }
};
</script>

<style scoped></style>
