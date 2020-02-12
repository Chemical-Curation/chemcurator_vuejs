<template>
  <div>
    <b-navbar toggleable="lg">
      <b-navbar-brand>ChemReg</b-navbar-brand>
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item>
            <router-link to="/">Home</router-link>
          </b-nav-item>
          <b-nav-item>
            <router-link to="/about">About</router-link>
          </b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>

<script>
export default {
  name: `navbar`
};
</script>

<style scoped>
  .navbar {
    height: 30px;
    background-color: #0071bc;
  }

  nav a {
    color: white;
  }

</style>
