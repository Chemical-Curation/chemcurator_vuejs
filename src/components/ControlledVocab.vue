<template>
      <dl>
        <dt>Name</dt>
        <dd id="name" class="mx-4">
          {{ vocab.name }}
        </dd>
        <dt>Label</dt>
        <dd id="label" class="mx-4">
          {{ vocab.label }}
        </dd>
        <dt>Short Description</dt>
        <dd class="mx-4">
          {{ vocab.shortDescription }}
        </dd>
        <dt>Long Description</dt>
        <dd class="mx-4">
          {{ vocab.longDescription }}
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
  }
};
</script>

<style scoped></style>
