<template>
  <b-form class="pb-3">
    <b-form-group
      label="Name:"
      label-align="left"
      label-cols="3"
      label-for="name"
      class="pb-3"
    >
      <b-form-input id="name" v-model="form.name"></b-form-input>
    </b-form-group>
    <b-form-group
      label="Label:"
      label-align="left"
      label-cols="3"
      label-for="label"
      class="pb-3"
    >
      <b-form-input id="label" v-model="form.label"></b-form-input>
    </b-form-group>
    <b-form-group
      label="Short Description:"
      label-align="left"
      label-cols="3"
      label-for="shortDescription"
      class="pb-3"
    >
      <b-form-textarea
        id="shortDescription"
        v-model="form.shortDescription"
      ></b-form-textarea>
    </b-form-group>
    <b-form-group
      label="Long Description:"
      label-align="left"
      label-cols="3"
      label-for="longDescription"
      class="pb-3"
    >
      <b-form-textarea
        id="longDescription"
        v-model="form.longDescription"
      ></b-form-textarea>
    </b-form-group>
    <b-form-group
      label="List Accessibility:"
      label-align="left"
      label-cols="3"
      label-for="listAccessibility"
      class="pb-3"
    >
      <b-form-select
        id="listAccessibility"
        v-model="form.listAccessibility"
        :options="accessibilityTypeOptions"
      ></b-form-select>
    </b-form-group>
    <b-form-group
      label="Owners:"
      label-align="left"
      label-cols="3"
      label-for="owners"
      class="pb-3"
    >
    </b-form-group>
    <b-form-group
      label="Source Url:"
      label-align="left"
      label-cols="3"
      label-for="sourceUrl"
      class="pb-3"
    >
      <b-form-textarea
        id="sourceUrl"
        v-model="form.sourceUrl"
      ></b-form-textarea>
    </b-form-group>
    <b-form-group
      label="Source Reference:"
      label-align="left"
      label-cols="3"
      label-for="sourceReference"
      class="pb-3"
    >
      <b-form-textarea
        id="sourceReference"
        v-model="form.sourceReference"
      ></b-form-textarea>
    </b-form-group>
    <b-form-group
      label="Source DOI:"
      label-align="left"
      label-cols="3"
      label-for="sourceDoi"
      class="pb-3"
    >
      <b-form-textarea
        id="sourceDoi"
        v-model="form.sourceDoi"
      ></b-form-textarea>
    </b-form-group>
    <b-form-group
      label="External Contact:"
      label-align="left"
      label-cols="3"
      label-for="externalContact"
      class="pb-3"
    >
    </b-form-group>
    <b-form-group
      label="Date of Source Collection:"
      label-align="left"
      label-cols="3"
      label-for="dateOfSourceCollection"
      class="pb-3"
    >
      <b-form-textarea
        id="dateOfSourceCollection"
        v-model="form.dateOfSourceCollection"
      ></b-form-textarea>
    </b-form-group>
    <b-form-group
      label="Types:"
      label-align="left"
      label-cols="3"
      label-for="types"
      class="pb-3"
    >
      <b-form-select
        id="types"
        v-model="form.types"
        :options="listTypeOptions"
      ></b-form-select>
    </b-form-group>
  </b-form>
</template>

<script>
import { mapGetters, mapState } from "vuex";

export default {
  name: "ListDetailsForm",
  computed: {
    ...mapGetters("list", { form: "getListDetailsForm" }),
    ...mapState("accessibilityType", { accessibilityTypeList: "list" }),
    ...mapState("externalContact", { externalContactList: "list" }),
    ...mapState("listType", { listTypeList: "list" }),
    ...mapState("user", { userList: "list" }),
    id: function() {
      return this.$route.params.id;
    },
    attribute: function() {
      return this.$store.state.list.attributes ?? {};
    },
    relationship: function() {
      return this.$store.state.list.relationships ?? {};
    },
    accessibilityTypeOptions: function() {
      return this.buildOptions(this.accessibilityTypeList);
    },
    userOptions: function() {
      return this.buildOptions(this.userList);
    },
    externalContactOptions: function() {
      return this.buildOptions(this.externalContactList);
    },
    listTypeOptions: function() {
      return this.buildOptions(this.listTypeList);
    }
  },
  methods: {
    buildOptions: function(list) {
      let item;
      let options = [];
      for (item of list)
        options.push({ value: item.id, text: item.attributes.name });
      return options;
    }
  },
  mounted() {
    // TODO: Once CRUD for ExternalContact and User is completed, add additional text areas for both relationships
    this.$store.dispatch("list/getObject", this.id);
    this.$store.dispatch("accessibilityType/getList", "accessibilityTypes");
    this.$store.dispatch("externalContact/getList", "externalContacts");
    this.$store.dispatch("listType/getList", "listTypes");
    this.$store.dispatch("user/getList", "users");
  }
};
</script>

<style scoped></style>
