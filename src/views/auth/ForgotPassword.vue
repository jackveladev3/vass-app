<template>
  <div
    class="w-full main-contents forgot-password-wrapper"
  >

   <Loading :loading="loading"/>

    <h6 class="text-center color-text-blue myheading" style="marginTop:26px">パスワードを忘れた方</h6>

    <p
      class="text-error text-xs" :class="error ? 'block' : 'hidden'"
      style="background: #FFD0D0; border-radius: 3px; border: 1px solid #FF4343; padding: 7px 30px;">
      <img src="@/assets/images/Vector.png" style="height: 14px; display: inline; margin-right: 16px;" alt="">
      {{ error }}
    </p>

    <div class="w-full" :class="step === 0 ? 'block' : 'hidden'" style="font-size:14px;">
      <p class="text-secondary input-label">メールアドレス</p>
      <!--<input
        class="w-full border border-dark input-text"
        v-model="email"
      />-->
      <v-text-field class="emailfield" v-model="email" label=""  height="34" outlined dense filled></v-text-field>
      <v-btn class="w-full submitbtn" @click="handleGetCode" >パスワードを変更する</v-btn>
      <!--<button
        class="w-full text-white"
        style="marginTop:30px;border-radius:3px;height:34px;outline:none;boxShadow:0px 2px 4px #00000080;background:rgb(52, 116, 155);"
        @click="handleGetCode"
      >
        送信
      </button>-->
      <p class="text-secondary color-text-blue" style="marginTop:35px;">
        本サービスに登録いただいたメールアドレスを入力してください。
入力いただいたメールアドレス宛にパスワード再設定用のリンクを送信させていただきます。
      </p>
    </div>
    <div class="w-full" :class="step === 1 ? 'block' : 'hidden'">
      <p class="text-secondary color-text-blue" style="marginTop:23px">
        認証コードと新しいパスワードを入力してください。
      </p>
      <p class="text-secondary input-label" style="marginTop:23px">認証コード</p>
      <!--<input
        class="w-full border border-dark"
        style="border-radius:3px;height:34px;marginTop:10px;outline:none;paddingLeft:4px;paddingRight:4px;"
        v-model="code"
      />-->
      <v-text-field class="emailfield" v-model="code" label=""  height="34" outlined dense filled></v-text-field>
      <p class="text-secondary input-label" style="marginTop:20px;">新しいパスワード</p>
      <!--<input
        class="w-full border border-dark"
        style="border-radius:3px;height:34px;marginTop:10px;outline:none;paddingLeft:4px;paddingRight:4px;"
        v-model="newPassword"
        type="password"
      />-->
      <v-text-field class="emailfield" type="password" v-model="newPassword" label=""  height="34" outlined dense filled></v-text-field>
      <p class="text-secondary input-label" style="marginTop:20px;">パスワードを認証する</p>
      <v-text-field class="emailfield" type="password" v-model="rePassword" label=""  height="34" outlined dense filled></v-text-field>
      <!--<input
        class="w-full border border-dark"
        style="border-radius:3px;height:34px;marginTop:10px;outline:none;paddingLeft:4px;paddingRight:4px;"
        v-model="rePassword"
        type="password"
      />-->
      <v-btn class="w-full submitbtn" @click="handleChangePwd" >パスワードを変更する</v-btn>
      <!--<button
        class="w-full bg-primary text-white"
        style="marginTop:30px;border-radius:3px;height:34px;outline:none;boxShadow:0px 2px 4px #00000080"
        @click="handleChangePwd"
      >
        パスワードを変更する
      </button>-->
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import { Auth } from 'aws-amplify'
import { SET_SUCCESS_MSG_ACTION } from '@/store/actionTypes'
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/vue-loading.css';

Vue.use(Loading)

export default {
  name: 'Forgotpassword',
  components: {
  },
  data () {
    return {
      email: '',
      code: '',
      newPassword: '',
      rePassword: '',
      step: 0,
      error: null,
      myloader:'',
    }
  },
  methods: {
    startLoader()
		{
			this.myloader = this.$loading.show({
                canCancel: false,
                color:'#34749B',
              });
		},
		stopLoader()
		{
			this.myloader.hide();
		},
    handleGetCode () {
      this.error = null

      if (this.email.length === 0) {
        this.error = 'メールを空にすることはできません。'
        return
      }

      this.startLoader();

      Auth.forgotPassword(this.email)
        .then((data) => {
          this.step = 1
          this.stopLoader();
        })
        .catch((err) => {
          // console.log(err)
          if (err.code === 'UserNotFoundException') {
            this.error = 'ユーザーが見つかりません。'
          } else if (err.code === 'LimitExceededException') {
            this.error =
              '試行制限を超えました。しばらくしてからもう一度お試しください。'
          } else {
            this.error = 'コードを送信することはできません。'
          }

          this.stopLoader();
        })
    },
    handleChangePwd () {
      this.error = null

      if (this.code.length === 0) {
        this.error = '確認コードを入力してください。'
        return
      }

      if (this.newPassword !== this.rePassword) {
        this.error = 'パスワードは同じではありません。'
        return
      }

      if (this.newPassword.length === 0) {
        this.error = 'パスワードは空にできません。'
        return
      }

      this.loading = true

      Auth.forgotPasswordSubmit(this.email, this.code, this.newPassword)
        .then((data) => {
          this.$store.dispatch(SET_SUCCESS_MSG_ACTION, 'パスワードを更新しました！')
          this.$router.push('login')
        })
        .catch((err) => {
          // console.log(err)
          if (err.code === 'CodeMismatchException') {
            this.error = '無効な検証コード。'
          } else if (
            err.code === 'InvalidParameterException' ||
            err.code === 'InvalidPasswordException'
          ) {
            this.error = 'パスワードがポリシーに準拠していません。'
          } else {
            this.error = 'パスワードを変更できません。'
          }

          this.loading = false
        })
    }
  }
}
</script>

<style scoped>
input { border-style: solid; }
.input-text{
  border-style:solid;
  border-radius:3px;
  height:34px;
  margin-top:7px;
  outline:none;
  padding-left:4px;
  padding-right:4px;
}
.input-label{
 margin-bottom: 0px !important;
}

.main-contents{
  padding:5px 40px 30px;
  margin-top:50px;
  border: 1px solid #ffffff;
  border-radius: 5px;
}
.emailfield >>>.v-input input {
max-height: 34px;
background-color: red !important;
}

.emailfield >>>.v-input__slot{
min-height: 34px !important;
}
.codefield >>>.v-input input {
max-height: 34px;
}

.codefield >>>.v-input__slot{
min-height: 34px !important;
}

.v-text-field__slot{
  width:100% !important;
  background-color: red !important;
}

.forgot-password-wrapper >>> .v-input--is-focused fieldset{
  border: 1px solid;
  border-color: #00000061;
}
.main-contents >>> .v-input--is-focused fieldset{
  border: 1px solid;
  border-color: #00000061;
}

</style>
