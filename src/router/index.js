import Vue from "vue";
import VueRouter from "vue-router";
import store from "@/store";
import Home from "@/views/Home.vue";
import { HTTP } from "@/store/http-common";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: Home,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/about",
    name: "about",
    component: () => import(/* webpackChunkName: "About" */ "../views/About"),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/login",
    name: "login",
    component: () => import(/* webpackChunkName: "Login" */ "../views/Login")
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  linkExactActiveClass: "vue-active",
  routes
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    const options = {
      method: "get",
      url: "login/",
      withCredentials: true
    };
    HTTP(options)
      .then(response => response)
      .catch(() => {
        next({ name: "login" });
      });
    // set the user to state for cypress tests loggedIn state
    if (window.Cypress && localStorage.user) {
      store.commit("CYPRESS_SET_USER", localStorage.user);
      next();
    }
    if (!store.state.auth.user) {
      next({ name: "login" });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
