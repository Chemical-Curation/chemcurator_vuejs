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
    component: () => import("../views/Vocabularies"),
    meta: {
      requiresAuth: true,
      requiresSuperuser: true
    }
  },
  {
    path: "/lists",
    name: "lists",
    component: () => import("../views/Lists")
  },
  {
    path: "/unauthorized",
    name: "unauthorized",
    component: () => import("../views/Unauthorized")
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
    if (to.meta.requiresSuperuser && !store.getters["auth/isSuperuser"]) {
      next({
        name: "unauthorized"
      });
      return;
    }
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
