import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/auth/Login.vue'
import Forgotpassword from '@/views/auth/ForgotPassword.vue'
import ChangePwd from '@/views/auth/ChangePwd'
import AuthComponent from '@/components/common/Auth.vue'
import Dashboard from '@/views/Dashboard.vue'
import ManagementWaitingRoom from '@/views/ManagementWaitingRoom.vue'
import StudentWaitingRoom from '@/views/StudentWaitingRoom.vue'
import MobileUploadMaterial from '@/views/MobileUploadMaterial.vue'
import TeacherWatingRoom from '@/views/TeacherWatingRoom'

import {
  checkLogin,
  getCredentialsNoAuth,
  jwtStudentAuthentication,
  jwtTutorAuthentication
} from '@/services/authGuard';

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/',
    component: AuthComponent,
    children: [
      {
        path: '/login',
        name: 'login',
        component: Login
      },
      {
        path: '/forgot_password',
        name: 'forgot_password',
        component: Forgotpassword
      },
      {
        path: 'change_password',
        name: 'change_password',
        component: ChangePwd
      }
    ]
  },
  {
    path: '/home',
    name: 'home',
    component: Dashboard,
    beforeEnter: checkLogin,
    meta: {
      title: '管理者 | Smartclass'
    }
  },
  {
    path: '/lectures/:id',
    name: 'management-waiting-room',
    component: ManagementWaitingRoom,
    beforeEnter: checkLogin,
    meta: {
      title: '管理者 | Smartclass'
    }
  },
  {
    path: '/classroom/student/:url',
    name: 'student-waiting-room',
    component: StudentWaitingRoom,
    beforeEnter: jwtStudentAuthentication,
    meta: {
      title: 'スマートクラス '
    }
  },
  {
    path: '/classroom/student/:lectureUrl/upload',
    name: 'mobile-upload-material',
    component: MobileUploadMaterial,
    beforeEnter: getCredentialsNoAuth,
    meta: {
      title: 'スマートクラス '
    }
  },
  {
    path: '/classroom/teacher/:url',
    name: 'teacher-waiting-room',
    component: TeacherWatingRoom,
    beforeEnter: jwtTutorAuthentication,
    meta: {
      title: 'スマートクラス '
    }
  },
  {
    path: '/classroom/teacher/:lectureUrl/upload',
    name: 'mobile-upload-material',
    component: MobileUploadMaterial,
    beforeEnter: getCredentialsNoAuth,
    meta: {
      title: 'スマートクラス '
    }
  },
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
