import axios from "axios";

export const HTTP = axios.create({
  baseURL: process.env.VUE_APP_API_URL
});

// HTTP.interceptors.response.use(
//   // this is currently our guard for loggedIn state
//   response => response,
//   error => {
//     store.dispatch("logout").then(() => {
//       router.push("/login");
//     });
//     return Promise.reject(error);
//   }
// );
