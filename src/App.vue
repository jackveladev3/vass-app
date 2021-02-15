<template>
  <v-app>
     <v-toolbar :class="{ scrolled: !view.atTopOfPage }" class="fixed flex w-full bg-white m-auto top-0 animated nav-bar">
      <v-app-bar-nav-icon
        v-if="menuIcon()"
        @click.stop="isOpenSideBar = !isOpenSideBar"
      ></v-app-bar-nav-icon>
      <v-toolbar-title
        ><img
          class="logo-img"
          @click="reload()"
          src="./assets/images/logo/logo.svg"
          style="height:40px"
      /></v-toolbar-title>

      <v-spacer></v-spacer>


    </v-toolbar>

    <SideBar :isOpenSideBar="isOpenSideBar" />

    <router-view />
  </v-app>
</template>

<script>

import SideBar from '@/components/common/SideBar.vue'

export default {
  name: 'App',
  components: {
    SideBar
  },
  data () {
    return {
      view: {
        atTopOfPage: true
      },
      isOpenSideBar: false
    }
  },

  // a beforeMount call to add a listener to the window
  beforeMount () {
    window.addEventListener('scroll', this.handleScroll)
  },
  watch: {
    '$route' (to, from) {
      document.title = to.meta.title || 'スマートクラス'
    }
  },
  methods: {
    // the function to call when the user scrolls, added as a method
    handleScroll () {
      // when the user scrolls, check the pageYOffset
      if (window.pageYOffset > 0) {
        // user is scrolled
        if (this.view.atTopOfPage) this.view.atTopOfPage = false
      } else {
        // user is at top of page
        if (!this.view.atTopOfPage) this.view.atTopOfPage = true
      }
    },
    menuIcon () {
      if (this.$route.name === 'home' || this.$route.name === 'management-waiting-room') { return true } else return false
    },
    reload () {
      location.reload();
    }
  }
}
</script>

<style scoped>

@media only screen and (max-width: 768px) {
  /* For mobile phones: */
  .nav-bar {
    padding-top: 10px !important;
    padding-bottom: 10px !important;
  }
}

nav {
  z-index: 10;
}

nav.scrolled {
  @apply shadow-md;
  border-bottom: 0px;
}

.nav-bar {
  z-index: 50 !important;
  /* padding: 22px 30px 18px 30px; */
  box-shadow: 0px 1px 20px rgba(111, 111, 111, 0.5);
}

.logo-img {
  cursor: pointer;
}
</style>
