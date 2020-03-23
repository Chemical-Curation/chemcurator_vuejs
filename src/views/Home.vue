<template>
  <div class="home">
    <!-- test that the login doesnt work and sends user to login -->
    <b-form>
      <b-button variant="primary" class="my-3" @click="login">Submit</b-button>
    </b-form>
    <!-- the above can be reomved but will serve as a way to show the interceptor is working -->
    <HelloWorld msg="Welcome to ChemReg" />
    <KetcherWindow />
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue";
import KetcherWindow from "../components/KetcherWindow";

export default {
  name: "home",
  components: {
    HelloWorld,
    KetcherWindow
  },
  methods: {
    // REMOVE
    login() {
      let username = "garbage";
      let password = "password";
      const options = {
        method: "post",
        url: "login/",
        auth: { username, password },
        withCredentials: true
      };
      this.$http(options)
        .then(response => {
          console.log("Cookie is still good!");
          console.log(response);
          console.log(response.status);
        })
        .catch(error => {
          console.log(error);
        });
    }
    // REMOVE
  }
};
</script>

<style scoped>
.home {
  width: 1024px;
  margin: auto;
}
</style>
