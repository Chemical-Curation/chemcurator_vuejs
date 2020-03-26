import { HTTP } from "@/store/http-common";

export function doIt() {
  const options = {
    method: "get",
    url: "login/",
    withCredentials: true
  };
  HTTP(options)
    .then(() => {
      this.uname = this.$store.state.auth.user;
    })
    .catch(() => {
      // alert("you're credentials are no longer good!");
    });
}
