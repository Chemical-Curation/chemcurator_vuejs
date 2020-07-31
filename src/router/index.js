import Vue from "vue";
import VueRouter from "vue-router";
import store from "@/store";
import Home from "@/views/Home.vue";

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
    path: "/vocabularies",
    name: "controlled-vocabularies",
    component: () => import(/* webpackChunkName: "ControlledVocabularies" */ "../views/Vocabularies"),
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

router.beforeEach(async (to, from, next) => {
  if (to.meta.requiresAuth) {
    await store.dispatch("auth/fetchUser");
    if (!store.getters["auth/isAuthenticated"]) {
      next({ name: "login" });
      return;
    }
  }
  next();
});

export default router;
