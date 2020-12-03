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
      <b-form-group class="pt-3" id="remember-check">
        <b-form-checkbox
          v-model="remember"
          value="true"
          unchecked-value="false"
        >
          Remember me
        </b-form-checkbox>
      </b-form-group>
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
      remember: false,
      error: ""
    };
  },
  watch: {
    remember: function(newValue) {
      if (newValue === "false") {
        this.$cookies.remove("username");
        this.$cookies.remove("password");
        this.form.username = "";
        this.form.password = "";
      }
    }
  },
  methods: {
    onSubmit: function() {
      this.$store
        .dispatch("auth/login", this.form)
        .then(() => {
          if (this.remember) {
            this.$cookies.set("username", this.form.username);
            this.$cookies.set("password", this.form.password);
          }
        })
        .catch(error => {
          this.error = error.response.data.detail;
          this.form.password = "";
          this.$refs["password"].focus();
        });
    }
  },
  mounted() {
    let username = this.$cookies.get("username");
    let password = this.$cookies.get("password");
    if (username && password) {
      this.form.username = username;
      this.form.password = password;
      this.remember = true;
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
