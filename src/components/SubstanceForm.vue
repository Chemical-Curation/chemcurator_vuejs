<template>
  <b-form class="pb-3">
    <b-form-group
      label="Substance ID:"
      label-align="left"
      label-cols="3"
      label-for="substanceID"
      class="pb-3"
    >
      <b-form-input
        id="substanceID"
        disabled
      ></b-form-input>
    </b-form-group>
    <b-form-group
      label="Preferred Name:"
      label-align="left"
      label-cols="3"
      label-for="preferredName"
      class="pb-3"
    >
      <b-form-input
        id="preferredName"
      ></b-form-input>
    </b-form-group>
    <b-form-group
      label="CAS-RN:"
      label-align="left"
      label-cols="3"
      label-for="casrn"
      class="pb-3"
    >
      <b-form-input
        id="casrn"
      ></b-form-input>
    </b-form-group>
    <b-form-group
      label="QC Level:"
      label-align="left"
      label-cols="3"
      label-for="qcLevel"
      class="pb-3"
    >
      <b-form-select
        id="qcLevel"
      ></b-form-select>
    </b-form-group>
    <b-form-group
      label="Source:"
      label-align="left"
      label-cols="3"
      label-for="source"
      class="pb-3"
    >
      <b-form-select
        id="source"
      ></b-form-select>
    </b-form-group>
    <b-form-group
      label="Substance Type:"
      label-align="left"
      label-cols="3"
      label-for="substanceType"
      class="pb-3"
    >
      <b-form-select
        id="substanceType"
      ></b-form-select>
    </b-form-group>
    <b-form-group
      label="Substance Description:"
      label-align="left"
      label-cols="3"
      label-for="substanceDescription"
      class="pb-3"
    >
      <b-form-textarea
        id="substanceDescription"
      ></b-form-textarea>
    </b-form-group>
    <b-form-group
      label="Private QC Notes:"
      label-align="left"
      label-cols="3"
      label-for="privateQCNotes"
      class="pb-3"
    >
      <b-form-textarea
        id="privateQCNotes"
      ></b-form-textarea>
    </b-form-group>
    <b-form-group
      label="Public QC Notes:"
      label-align="left"
      label-cols="3"
      label-for="publicQCNotes"
      class="pb-3"
    >
      <b-form-textarea
        id="publicQCNotes"
      ></b-form-textarea>
    </b-form-group>
  </b-form>
</template>

<script>
export default {
  name: "SubstanceForm"
}
</script>

<style scoped>

</style>
