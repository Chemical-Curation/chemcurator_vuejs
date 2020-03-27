import store from "@/store";

// this is likely not the way to test the store
// it probably doesn't even need to happen here,
// cause it's already checked in the e2e tests.

test("logout mutation logs out user from state", () => {
  store.state.auth.user = "annabelle";
  expect(store.state.auth.user).toBe("annabelle");
  store.commit("auth/LOGOUT");
  expect(store.state.auth.user).toBe("");
});

test("getter returns proper isLoggedIn state", () => {
  expect(store.getters["auth/isLoggedIn"]).toBe(false);
  store.state.auth.user = "annabelle";
  expect(store.getters["auth/isLoggedIn"]).toBe(true);
});
