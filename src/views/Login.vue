<template>
  <b-card id="login" title="Welcome to ChemReg!">
    <div>
      <img src="@/assets/logo_96px.png" alt="logo" class="mb-2" />
    </div>
    <b-alert
      show
      fade
      :variant="variant"
      ref="message"
      v-bind:class="{ 'm-0 p-0 ': true, shake: variant === 'danger' }"
      >{{ message }}</b-alert
    >
    <b-form>
      <b-input-group class="my-2">
        <template v-slot:prepend>
          <b-input-group-text>
            <b-icon icon="person-fill" />
          </b-input-group-text>
        </template>
        <b-form-input
          v-model="$v.form.username.$model"
          :state="validateState('username')"
          aria-describedby="username-live-feedback"
          placeholder="username"
          id="text-username"
          class="rounded-right"
        />
        <b-form-invalid-feedback id="username-live-feedback"
          >This is a required field.</b-form-invalid-feedback
        >
      </b-input-group>
      <b-input-group aria-describedby="password-live-feedback">
        <template v-slot:prepend>
          <b-input-group-text v-on:click="showPassword">
            <b-icon icon="lock-fill" />
          </b-input-group-text>
        </template>
        <b-form-input
          v-model="$v.form.password.$model"
          :state="validateState('password')"
          type="password"
          id="text-password"
          placeholder="password"
        />
        <div class="input-group-append" v-on:click="showPassword" id="eye">
          <span class="input-group-text rounded-right">
            <b-icon icon="eye-fill" />
          </span>
          <b-tooltip target="eye" triggers="hover" placement="right"
            >Show Password</b-tooltip
          >
        </div>
        <b-form-invalid-feedback id="password-live-feedback">
          This is a required field and must be at least 8 characters.
        </b-form-invalid-feedback>
      </b-input-group>
      <b-button variant="primary" class="my-3" name="submit" @click="login"
        >Submit</b-button
      >
    </b-form>
  </b-card>
</template>

<script>
import { HTTP } from "@/store/http-common";
import { validationMixin } from "vuelidate";
import { required, minLength } from "vuelidate/lib/validators";

export default {
  name: "Login",
  mixins: [validationMixin],
  data() {
    return {
      message: "Please log in...",
      variant: "light",
      dismissSecs: 5,
      dismissCountDown: 0,
      form: {
        username: null,
        password: null
      }
    };
  },
  validations: {
    form: {
      username: {
        required
      },
      password: {
        required,
        minLength: minLength(8) // default django password length
      }
    }
  },
  methods: {
    resetMsg() {
      this.variant = "light";
      this.$refs.message.$el.innerText = this.message;
    },
    sendError() {
      this.variant = "danger";
      this.$refs.message.$el.innerText = "Invalid username/password.";
      setTimeout(this.resetMsg, 3047);
    },
    showPassword() {
      const obj = document.getElementById("text-password");
      obj.type = obj.type === "text" ? "password" : "text";
    },
    validateState(name) {
      const { $dirty, $error } = this.$v.form[name];
      return $dirty ? !$error : null;
    },
    login() {
      this.$v.form.$touch();
      if (this.$v.form.$anyError) {
        return;
      }
      let username = this.form.username;
      let password = this.form.password;
      const options = {
        method: "post",
        url: "login/",
        auth: { username, password },
        withCredentials: true
      };
      HTTP(options)
        .then(() => {
          this.$store.dispatch("auth/login", username);
          this.$router.push("/");
        })
        .catch(error => {
          this.sendError();
          return Promise.reject(error);
        });
    }
  }
};
</script>

<style scoped>
#login {
  max-width: 27em;
  margin: auto;
  margin-top: 47px;
}
img {
  animation: rotation 11s infinite linear;
}
@keyframes rotation {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(359deg);
  }
}
.shake {
  animation: shake 0.74s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
  transform: translate3d(0, 0, 0);
}

@keyframes shake {
  10%,
  90% {
    transform: translate3d(-1px, 0, 0);
  }

  20%,
  80% {
    transform: translate3d(2px, 0, 0);
  }

  30%,
  50%,
  70% {
    transform: translate3d(-4px, 0, 0);
  }

  40%,
  60% {
    transform: translate3d(4px, 0, 0);
  }
}
</style>
