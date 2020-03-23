import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import axios from "axios";
import Vuelidate from "vuelidate";
import {
  BootstrapVue,
  IconsPlugin
} from "bootstrap-vue/dist/bootstrap-vue.esm";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

Vue.config.productionTip = false;
Vue.use(BootstrapVue);
Vue.use(IconsPlugin);
Vue.use(Vuelidate);

const axiosConfig = {
  baseURL: process.env.VUE_APP_API_URL
  // timeout: 30000 // not sure what to set here, default is 0.
  // https://github.com/axios/axios/blob/master/README.md#request-config
};
const api = axios.create(axiosConfig);

Vue.prototype.$http = api;

api.interceptors.response.use(
  // this is currently our guard for loggedIn state, status codes may need to change
  response => {
    if (response.status === 200 || response.status === 201) {
      return Promise.resolve(response);
    } else {
      return Promise.reject(response);
    }
  },
  () => {
    // cookie no longer good
    if (store.state.user) {
      store.dispatch("logout").then(() => {
        router.push("/login");
      });
    }
    throw new Error("Go back to start, do not pass go, do not collect $200!");
  }
);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
