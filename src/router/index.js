import Vue from "vue";
import VueRouter from "vue-router";
import store from "@/store";
import Home from "@/views/Home.vue";

Vue.use(VueRouter);

const routes = [{
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
    component: () => import("../views/About"),
    meta: {
      requiresAuth: false,
    }
  },
  {
    path: "/login",
    name: "login",
    component: () => import("../views/Login")
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
        name: "login"
      });
      return;
    }
  }
  next();
});

export default router;
