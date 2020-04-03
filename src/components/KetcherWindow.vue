<template>
  <div>
    <h2>Ketcher</h2>
    <iframe
      id="ketcher"
      class="ketcher"
      data-cy="ketcher"
      v-bind:src="ketcherURL"
      width="800"
      height="600"
    >
      ketcher
    </iframe>
  </div>
</template>

<script>
export default {
  name: "KetcherWindow",
  data() {
    return {
      ketcherURL: process.env.VUE_APP_KETCHER_URL
    };
  }
};
</script>
