<template>
  <b-alert
    :show="dismissCountDown"
    dismissible
    fade
    :variant="color"
    v-on:dismissed="clearState"
    @dismiss-count-down="countDownChanged"
    data-cy="alert-box"
  >
    <h4 class="alert-heading">{{ header }}</h4>
    <hr v-show="header" />
    <span v-html="message"></span>
  </b-alert>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "Alert",
  methods: {
    countDownChanged(dismissCountDown) {
      this.dismissCountDown = dismissCountDown;
    },
    clearState() {
      this.$store.commit("alert/clearState");
    }
  },
  computed: {
    dismissCountDown: {
      get() {
        return this.$store.state.alert.dismissCountDown;
      },
      set(value) {
        this.$store.commit("alert/setCountdown", value);
      }
    },
    ...mapState("alert", ["message", "color", "header"])
  }
};
</script>
