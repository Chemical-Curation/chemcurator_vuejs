<template>
  <b-card id="login-card" class="shadow">
    <b-alert variant="danger" :show="!!error">{{ error }}</b-alert>
    <b-form @submit.prevent="onSubmit">
      <b-input-group id="username-field">
        <b-input-group-prepend is-text>
          <b-icon icon="person-fill" />
        </b-input-group-prepend>
        <b-form-input
          autofocus
          name="username"
          placeholder="username"
          required
          v-model="form.username"
        />
      </b-input-group>
      <b-input-group id="password-field">
        <b-input-group-prepend is-text>
          <b-icon icon="lock-fill" />
        </b-input-group-prepend>
        <b-form-input
          name="password"
          placeholder="password"
          ref="password"
          required
          type="password"
          v-model="form.password"
        />
      </b-input-group>
      <b-button block variant="primary" class="my-3" type="submit"
        >Submit</b-button
      >
    </b-form>
  </b-card>
</template>

<script>
export default {
  name: "LoginCard",
  data() {
    return {
      form: {
        username: "",
        password: ""
      },
      error: ""
    };
  },
  methods: {
    onSubmit: function() {
      this.$store.dispatch("auth/login", this.form).catch(error => {
        this.error = error.response.data.detail;
        this.form.password = "";
        this.$refs["password"].focus();
      });
    }
  }
};
</script>

<style scoped>
#login-card {
  max-width: 300px;
}
#username-field * {
  border-radius: 0rem;
}
#username-field .input-group-text {
  border-top-left-radius: 0.25rem;
}
#username-field .form-control {
  border-top-right-radius: 0.25rem;
}
#password-field * {
  border-top: none;
  border-radius: 0rem;
}
#password-field .input-group-text {
  border-bottom-left-radius: 0.25rem;
}
#password-field .form-control {
  border-bottom-right-radius: 0.25rem;
}
</style>
