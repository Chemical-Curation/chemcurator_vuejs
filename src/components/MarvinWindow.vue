<template>
  <div>
    <iframe
      id="marvin"
      class="marvin"
      data-cy="marvin"
      v-bind:src="marvinURL"
      width="800"
      height="600"
      scrolling="no"
    >
      marvin
    </iframe>
  </div>
</template>

<script>
export default {
  name: "MarvinWindow",
  data() {
    return {
      marvinURL: process.env.VUE_APP_MARVIN_URL
    };
  }
};
</script>
