<template v-if="vocab">
  <dl>
    <dt>Name</dt>
    <dd :id="this.nameLabel" class="mx-4">
      {{ vocab.attributes.name }}
    </dd>
    <dt>Label</dt>
    <dd :id="this.labelLabel" class="mx-4">
      {{ vocab.attributes.label }}
    </dd>
    <dt>Short Description</dt>
    <dd :id="this.shortLabel" class="mx-4">
      {{ vocab.attributes.shortDescription }}
    </dd>
    <dt>Long Description</dt>
    <dd :id="this.longLabel" class="mx-4">
      {{ vocab.attributes.longDescription }}
    </dd>
  </dl>
</template>
<script>
export default {
  name: "ControlledVocab",
  props: {
    vocab: {
      type: Object
    }
  },
  computed: {
    nameLabel: function() {
      return this.vocab.type + "-name-" + this.vocab.id;
    },
    labelLabel: function() {
      return this.vocab.type + "-label-" + this.vocab.id;
    },
    shortLabel: function() {
      return this.vocab.type + "-short-" + this.vocab.id;
    },
    longLabel: function() {
      return this.vocab.type + "-long-" + this.vocab.id;
    }
  }
};
</script>

<style scoped></style>
