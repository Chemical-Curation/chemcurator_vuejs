<template>
  <b-row>
    <b-col class="col-lg-6">
      <ControlledVocab :vocab="attributes" />
    </b-col>
    <b-col class="col-lg-6">
      <dl>
        <dt>SourceURL</dt>
        <dd class="mx-4">
          {{ this.attributes.sourceUrl }}
        </dd>
        <dt>Source Reference</dt>
        <dd class="mx-4">
          {{ this.attributes.sourceReference }}
        </dd>
        <dt>Source DOI</dt>
        <dd class="mx-4">
          {{ this.attributes.sourceDoi }}
        </dd>
        <dt>Date of Source Collection:</dt>
        <dd class="mx-4">
          {{ this.attributes.dateOfSourceCollection }}
        </dd>
      </dl>
      <b-row class="d-block">
        <div class="m-3">
          <b>Accessibility Type:</b>
          <b-button class="mx-4" pill variant="outline-secondary" v-b-modal.modal-1>
            <b>{{ accessibilityType.attributes }}</b>
          </b-button>
          <b-modal id="modal-1" title="Accessibility Type">
            <ControlledVocab :vocab="accessibilityType.attributes" />
          </b-modal>
        </div>
        <div class="m-3">
          <b>List Types:</b>
          <div class="d-inline" v-for="type in listTypes" :key="type.id">
            <b-button class="mx-4" pill variant="outline-secondary" v-b-modal="type.id">
              <b>{{ type.attributes.name }}</b>
            </b-button>
            <b-modal :id="type.id" title="List Type">
              <ControlledVocab :vocab="type.attributes" />
            </b-modal>
          </div>
        </div>
      </b-row>
    </b-col>
  </b-row>
</template>
<script>
import { mapGetters } from "vuex";
import ControlledVocab from "@/components/ControlledVocab";

export default {
  name: "ListDetailsForm",
  components: {
    ControlledVocab
  },
  computed: {
    ...mapGetters("list", [ "getIncluded" ]),
    id: function() {
      return this.$route.params.id;
    },
    attributes: function() {
      return this.$store.state.list.attributes ?? {};
    },
    listTypes: function() {
      return this.getIncluded("types");
    },
    accessibilityType: function() {
      return this.getIncluded("listAccessibility");
    },
  },
  mounted() {
    // TODO: Once CRUD for ExternalContact and User is completed, add additional text areas for both relationships
    this.$store.dispatch("list/getObject", this.id);
  }
};
</script>

<style scoped></style>
