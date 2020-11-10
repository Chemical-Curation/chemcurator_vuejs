<template>
  <b-form class="pb-3">
    <div v-for="(formKey, index) in Object.keys(form)" :key="index">
      <SubstanceFormInput
        :field="formKey"
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
      const { id } = substanceForm ;

      if (id) {
        console.log(id);
        // if there is an id, patch the currently loaded substance.
        this.$store
          .dispatch("substance/patch", {
            id: id,
            body: { ...substanceForm }
          })
          // Handle the errors
          .catch(err => {console.log("patch", err)});
      } else {
        // If there is no id, save the new substance.
        this.$store
          .dispatch("substance/post", substanceForm)
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
            this.$store.commit("substance/clearValidated");
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
