import Vue from "vue";
import VueRouter from "vue-router";
import store from "@/store";
import Home from "@/views/Home.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: Home
  },
  {
    path: "/substance",
    name: "substance",
    component: () => import("../views/Substance"),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/vocabularies",
    name: "controlled-vocabularies",
    component: () =>
      import(
        /* webpackChunkName: "ControlledVocabularies" */
        "../views/Vocabularies"
      ),
    meta: {
      // todo: Admin Only
      requiresAuth: true
    }
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
      next({
        name: "home"
      });
      return;
    }
  }
  next();
});

export default router;
