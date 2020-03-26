export function doIt() {
  const options = {
    method: "get",
    url: "login/",
    withCredentials: true
  };
  this.$http(options)
    .then(() => {
      this.uname = this.$store.state.user;
    })
    .catch(error => {
      // alert("you're credentials are no longer good!");
      console.log(error);
    });
}
