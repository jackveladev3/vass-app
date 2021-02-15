<template>
  <div
    class="w-full main-contents"
  >

    <Loading :loading="loading"/>

    <p class="text-center color-text-blue" style="marginTop:26px">パスワードの設定</p>

    <p
      class="text-error text-xs" :class="error ? 'block' : 'hidden'"
      style="background: #FFD0D0; border-radius: 3px; border: 1px solid #FF4343; padding: 7px 30px;">
      <img src="@/assets/images/Vector.png" style="height: 14px; display: inline; margin-right: 16px;" alt="">
      {{ error }}
    </p>

    <h6 class="text-secondary myheading" style="marginTop:23px;">新しいパスワード</h6>
    <v-text-field class="passfield" type="password" v-model="newPassword" label=""  height="34" outlined dense filled></v-text-field>
    <!--<input
      class="w-full border border-dark"
      style="border-radius:3px;height:34px;marginTop:10px;outline:none;paddingLeft:4px;paddingRight:4px;"
      v-model="newPassword"
      type="password"
    />-->
    <p class="text-secondary" style="marginTop:20px;">パスワードを認証する</p>
    <v-text-field class="passfield" :type="eyeIconFas ? 'password' : 'text'" v-model="rePassword" label=""  height="34" outlined dense filled>
        <template slot="append">
          <i class="fa-eye eye-icon" v-bind:class="{ far: eyeIconFar, fas: eyeIconFas }" @click="toggleEye"></i>
        </template>
    </v-text-field>
    <!--<input
      class="w-full border border-dark"
      style="border-radius:3px;height:34px;marginTop:10px;outline:none;paddingLeft:4px;paddingRight:4px;"
      v-model="rePassword"
      :type="eyeIconFas ? 'password' : 'text'"
    />-->
    <!--<i class="fa-eye eye-icon" v-bind:class="{ far: eyeIconFar, fas: eyeIconFas }" @click="toggleEye"></i>-->
    <v-btn class="w-full submitbtn text-white" @click="handleChangePwd" >パスワードを変更する</v-btn>
    <!--<button
      class="w-full bg-primary text-white"
      style="marginTop:30px;border-radius:3px;height:34px;outline:none;boxShadow:0px 2px 4px #00000080"
      @click="handleChangePwd"
    >
      パスワードを変更する
    </button>-->
  </div>
</template>

<script>
import { Auth } from 'aws-amplify'
import Loading from '@/components/common/Loading'
import { SET_USER_ACTION,  SET_SUCCESS_MSG_ACTION } from '@/store/actionTypes';

export default {
  data () {
    return {
      newPassword: '',
      rePassword: '',
      error: null,
      eyeIconFar: false,
      eyeIconFas: true,
      loading: false
    }
  },
  components: {
    Loading
  },
  methods: {
    handleChangePwd () {
      this.error = null

      if (this.newPassword.length === 0) {
        this.error = 'パスワードは空にできません。'
        return
      }

      const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;

      if(!regex.test(this.newPassword)){
        this.error = '許可されていません。→ パスワードは8文字以上で数字、アルファベット大文字、小文字と記号を含めてください'
        return
      }

      if (this.newPassword !== this.rePassword) {
        this.error = 'パスワードは同じではありません。'
        return
      }

      const user = this.$store.getters.getUser

      if (user.challengeName !== 'NEW_PASSWORD_REQUIRED') {
        this.error = 'あなたはすでに実際のパスワードを持っています。'
        return
      }

      if (user !== null) {
        this.loading = true

        Auth.completeNewPassword(user, this.newPassword)
          .then((user) => {
            this.$store.dispatch(SET_USER_ACTION, user)

            this.$store.dispatch(
              SET_SUCCESS_MSG_ACTION,
              'パスワードの設定が完了しました！'
            )

            this.$router.push('login')
          })
          .catch((err) => {
            // console.log(err)
            if (err.code === 'NotAuthorizedException') {
              this.error = 'パスワードは8文字以上でアルファベット大文字、小文字と記号を含めてください'
            } else if (err.code === 'InvalidPasswordException') {
              this.error = 'パスワードがポリシーに準拠していません。'
            } else {
              this.error = 'パスワードを変更できません。'
            }
            this.loading = false
          })
      } else {
        this.error = '最初にログインしてください。'
      }
    },
    toggleEye () {
      this.eyeIconFar = !this.eyeIconFar
      this.eyeIconFas = !this.eyeIconFas
    }
  }
}
</script>

<style scoped>

input { border-style: solid; }

.text-secondary{margin-bottom: 0px;}

.eye-icon{
  float: right;
  margin-right: 5px;
  position: relative;
  cursor: pointer;
}

.main-contents{
  padding-left: 50px;
  padding-right: 50px;
  padding-bottom: 25px;
  margin-top:50px;
  border: 1px solid #ffffff;
  border-radius: 5px;
}
.passfield >>>.v-input input {
max-height: 34px;
}

.passfield >>>.v-input__slot{
min-height: 34px !important;
}
.main-contents >>> .v-input--is-focused fieldset{
  border: 1px solid;
  border-color: #00000061;
}
</style>
