<template>
    <v-navigation-drawer temporary v-model="isOpen" class="left-0 w-64 bg-white fixed h-full overflow-auto">
        <v-list-item @click="move('home')">
          <v-list-item-content>
            <v-list-item-title>Home</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <template v-slot:append>
        <div class="pa-2 text-center">

          <a class="logout-link" href="#" v-on:click.prevent="handleLogout">ログアウト</a>

        </div>
      </template>
    </v-navigation-drawer>
</template>

<script>
import AuthService from '@/services/auth';
export default {
  props: {
    isOpenSideBar: Boolean
  },
  data () {
    return {
      isOpen: false
    }
  },
  methods: {
    drawer () {
      this.isOpen = !this.isOpen
    },
    move (path) {
      this.isOpen = false
      this.$router.push({ name: path, query: { utm_source: this.$route.query.utm_source } })
    },
    handleLogout() {
      this.isOpen = false;
      AuthService.logout();
    }
  },
  watch: {
    isOpen: {
      immediate: true,
      handler (isOpen) {
        if (process.client) {
          if (isOpen) document.body.style.setProperty('overflow', 'hidden')
          else document.body.style.removeProperty('overflow')
        }
      }
    },
    isOpenSideBar: {
      handler (newVal, oldVal) {
        this.isOpen = !this.isOpen
      },
      deep: true
    }
  },
  mounted () {
    document.addEventListener('keydown', e => {
      if (e.keyCode == 27 && this.isOpen) this.isOpen = false
    })
  }
}
</script>

<style scoped>
.v-list-item:hover {
  background-color: #57a9ca;
}
.v-list-item {
  background-color: #57a9ca;
  margin-bottom: 4px;
  margin-left: 4px;
  margin-right: 4px;
  border-radius: 3px;
  color: white;
  font-size: 16px;
  height: 42px;
}
.v-list-item__title {
  color: white;
  font-size: 16px;
  margin-left: auto;
  margin-right: auto;
}
aside {
  z-index: 50 !important;
  width: 240px;
  height: calc(100vh - 64px) !important;
  margin-top: 64px;
  box-shadow: 4px 4px 9px rgba(0, 0, 0, 0.25);
}
.logout-link{
  color: #34769C;
  font-size: 16px;
  font-weight: 500;
}
</style>
