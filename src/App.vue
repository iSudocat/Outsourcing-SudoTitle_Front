<template>
  <div id="App">
    <div class="flexible-content">
      <!--Navbar-->
      <mdb-navbar class="flexible-navbar white" light position="top" scrolling>
        <mdb-navbar-brand href="https://mdbootstrap.com/docs/vue/" target="_blank">
          SudoTitle——教学视频语音提取文本系统
        </mdb-navbar-brand>
        <mdb-navbar-toggler>
          <!--
          <mdb-navbar-nav left>
            <mdb-nav-item to="/" waves-fixed active class="active"
              >Home</mdb-nav-item
            >
            <mdb-nav-item
              href="https://mdbootstrap.com/docs/vue/getting-started/quick-start/"
              waves-fixed
              >About MDB</mdb-nav-item
            >
          </mdb-navbar-nav>
          -->
          <mdb-navbar-nav right>
            <mdb-nav-item>{{ getUsername }}</mdb-nav-item>
            <mdb-nav-item>
              <mdb-btn v-show="showLogout" outline="blue-grey" size="sm" class="my-0" type="submit" @click='logoutClick'>
                <mdb-icon icon="sign-out-alt"/>注销
              </mdb-btn>
            </mdb-nav-item>
          </mdb-navbar-nav>
        </mdb-navbar-toggler>
      </mdb-navbar>
      <!--/.Navbar-->
      <!-- Sidebar -->
      <div class="sidebar-fixed position-fixed">
        <a class="logo-wrapper"
        ><img alt="" class="img-fluid" height="200" src="./assets/SudoTitle.png"
        /></a>
        <mdb-list-group class="list-group-flush">
          <router-link to="/login" @click.native="activeItem = 1">
            <mdb-list-group-item
                :action="true"
                :class="activeItem === 1 && 'active'"
            >
              <mdb-icon icon="user" class="mr-3"/>
              登录
            </mdb-list-group-item
            >
          </router-link>
          <router-link to="/audit" @click.native="activeItem = 2">
            <mdb-list-group-item
                :action="true"
                :class="activeItem === 2 && 'active'"
            >
              <mdb-icon
                  icon="chart-pie"
                  class="mr-3"
              />
              审计
            </mdb-list-group-item
            >
          </router-link>
          <router-link to="/videoList" @click.native="activeItem = 3">
            <mdb-list-group-item
                :action="true"
                :class="activeItem === 3 && 'active'"
            >
              <mdb-icon icon="table" class="mr-3"/>
              视频列表
            </mdb-list-group-item
            >
          </router-link>

        </mdb-list-group>
      </div>
      <!-- /Sidebar  -->
      <main>
        <div class="mt-5 p-5">
          <router-view></router-view>
        </div>
        <ftr color="primary-color" class="text-center font-small darken-2">
          <p class="footer-copyright mb-0 py-3 text-center">
            &copy; {{ new Date().getFullYear() }} Copyright SudoTitle
          </p>
        </ftr>
      </main>
    </div>
  </div>
</template>

<script>
/* eslint-disable */

import {
  mdbNavbar,
  mdbNavbarBrand,
  mdbNavItem,
  mdbNavbarNav,
  mdbNavbarToggler,
  mdbIcon,
  mdbListGroup,
  mdbListGroupItem,
  mdbFooter,
  waves,
  mdbBtn
} from "mdbvue";

export default {
  name: "AdminTemplate",
  components: {
    mdbNavbar,
    mdbNavbarBrand,
    mdbNavItem,
    mdbNavbarNav,
    mdbNavbarToggler,
    mdbListGroup,
    mdbListGroupItem,
    mdbIcon,
    mdbBtn,
    ftr: mdbFooter
  },
  data() {
    return {
      activeItem: 1,
    };
  },
  beforeMount() {
    this.activeItem = this.$route.matched[0].props.default.page;
  },
  mounted() {

  },
  computed: {
    getUsername: function () {
      if (this.$cookies.get('username') !== null) {
        return '欢迎您，' +this.$cookies.get('username')
      } else {
        return ''
      }
    },
    showLogout: function () {
      return this.$cookies.get('username') !== null
    }
  },
  methods: {
    logoutClick: function () {
      console.log('注销')
      this.$cookies.remove('username')
      this.$cookies.remove('access_token')
      //this.$store.commit('setState', ['username', ''])
      //this.$store.commit('setState', ['access_token', ''])
      this.$router.go(0);
      this.activeItem = 1
    }
  },
  mixins: [waves]
};
</script>

<style>
@import url("https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap");

.navbar-light .navbar-brand {
  margin-left: 15px;
  color: #2196f3 !important;
  font-weight: bolder;
}
</style>

<style scoped>
main {
  background-color: #ededee;
}

.flexible-content {
  transition: padding-left 0.3s;
  padding-left: 270px;
}

.flexible-navbar {
  transition: padding-left 0.5s;
  padding-left: 270px;
}

.sidebar-fixed {
  left: 0;
  top: 0;
  height: 100vh;
  width: 270px;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);
  z-index: 1050;
  background-color: #fff;
  padding: 1.5rem;
  padding-top: 0;
}

.sidebar-fixed .logo-wrapper img {
  width: 100%;
  padding: 2.5rem;
}

.sidebar-fixed .list-group-item {
  display: block !important;
  transition: background-color 0.3s;
}

.sidebar-fixed .list-group .active {
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);
  border-radius: 5px;
}

@media (max-width: 1199.98px) {
  .sidebar-fixed {
    display: none;
  }

  .flexible-content {
    padding-left: 0;
  }

  .flexible-navbar {
    padding-left: 10px;
  }
}
</style>
