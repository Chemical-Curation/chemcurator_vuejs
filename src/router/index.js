import Vue from "vue";
import VueRouter from "vue-router";
import store from "@/store";
import Home from "@/views/Home.vue";
import auth from "@/store/modules/auth";

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
    component: () => import("../views/Substance")
  },
  {
    path: "/substance/:sid",
    name: "substance_detail",
    component: () => import("../views/Substance")
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
    path: "/lists/:id",
    name: "list-details",
    component: () => import("../views/ListDetails")
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
  // validate and wait for every navigation.  This should probably be done in the background
  await store.dispatch("auth/fetchUser");
  if (to.meta.requiresAuth) {
    if (to.meta.requiresSuperuser && !store.getters["auth/isSuperuser"]) {
      next({
        name: "unauthorized"
      });
      return;
    }
    if (!store.getters["auth/isAuthenticated"]) {
      const username = auth.state.username;
      const alert = {
        message: !username
          ? "Please log in..."
          : `${username}, you are no longer logged in!`,
        color: !username ? "success" : "danger",
        dismissCountDown: 4
      };
      store.dispatch("alert/alert", alert, {
        root: true
      });
      next({
        name: "home"
      });
      return;
    }
  }
  next();
});

export default router;
