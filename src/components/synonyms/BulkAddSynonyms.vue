<template>
  <div class="border rounded my-5 p-5">
    <h2>Add Synonyms</h2>

    <b-form @submit.prevent="onSubmit">
      <b-form-group label="Source">
        <b-form-select v-model="form.source" :options="sourceListOptions()" required></b-form-select>
      </b-form-group>

      <b-form-group label="Quality">
        <b-form-select v-model="form.quality" :options="qualityListOptions()" required></b-form-select>
      </b-form-group>

      <b-form-group label="Type">
        <b-form-select v-model="form.type" :options="typeListOptions()"></b-form-select>
      </b-form-group>

      <b-form-group label="Identifiers">
        <b-form-textarea v-model="form.identifiers" placeholder="Please provide list of identifiers..." required></b-form-textarea>
      </b-form-group>

      <div class="d-flex flex-row-reverse">
        <b-button type="submit" variant="primary">Save</b-button>
      </div>

    </b-form>

  </div>
</template>

<script>
import {mapGetters} from "vuex";

export default {
  name: "BulkAddSynonyms",
  data() {
    return {
      form: {
        source: null,
        quality: null,
        type: null,
        identifiers: "",
      }
    }
  },
  methods: {
    onSubmit: function(){
      alert("Submitted")
    }
  },
  computed: {
    ...mapGetters("synonymQuality", { qualityListOptions: "getOptions" }),
    ...mapGetters("source", { sourceListOptions: "getOptions" }),
    ...mapGetters("synonymType", { typeListOptions: "getOptions" }),
  }
};
</script>
