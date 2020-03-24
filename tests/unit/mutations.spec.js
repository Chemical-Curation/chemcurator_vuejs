import store from "@/store";

// this is likely not the way to test the store
// it probably doesn't even need to happen here,
// cause it's already checked in the e2e tests.

test("logout mutation logs out user from state", () => {
  store.state.user = "annabelle";
  expect(store.state.user).toBe("annabelle");
  store.commit("LOGOUT");
  expect(store.state.user).toBe("");
});

test("getter returns proper isLoggedIn state", () => {
  expect(store.getters.isLoggedIn).toBe(false);
  store.state.user = "annabelle";
  expect(store.getters.isLoggedIn).toBe(true);
});
