<template>
  <div
    class="w-full login-contents">
    <h6 class="text-center myheading">ログイン</h6>
    <p
      class="text-error text-xs" :class="userError ? 'block' : 'hidden'"
      style="background: #FFD0D0; border-radius: 3px; border: 1px solid #FF4343; padding: 7px 30px;">
      <img src="@/assets/images/Vector.png" style="height: 14px; display: inline; margin-right: 16px;" alt="">
      {{ userError }}</p>
    <p class="text-secondary" style="marginBottom: 0;">メールアドレス</p>
    <v-text-field class="emailfield" v-model="email" label=""  height="34" outlined dense filled></v-text-field>
    <p class="text-secondary" style="marginTop:20px;marginBottom:0;">パスワード</p>
    <v-text-field class="passfield" type="password" v-model="password" label=""  height="34" outlined dense filled></v-text-field>
    <v-btn class="w-full submitbtn" @click="handleLogin" >ログイン</v-btn>
    <router-link :to="{name: 'forgot_password'}">
      <p class="text-center" style="color:#3D5170;marginTop:30px">
        パスワードを忘れた方はこちら
      </p>
    </router-link>
  </div>
</template>

<script>
import Vue from 'vue';
import awsconfig from '@/utils/aws-exports';
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
import AuthService from '@/services/auth';
import {
  SET_APIGCLIENT_ACTION,
  SET_USER_ACTION,
  SET_ISLOGGEDIN_ACTION,
  SET_SUCCESS_MSG_ACTION,
  SET_ERROR_MSG_ACTION,
  SET_JWTTOKEN_ACTION
} from '@/store/actionTypes';

Vue.use(Loading);

export default {
  name: 'Login',
  components: {
  },
  data () {
    return {
      email: '',
      password: '',
      userError: null,
      passwordError: null,
      successMsg: null,
      myloader:'',
    }
  },
  created() {
    if(localStorage.getItem('jwtToken')) {
      this.$router.push('home');
    }
  },
  mounted () {
    this.successMsg = this.$store.getters.getSuccessMsg
    this.userError = this.$store.getters.errorMsg
  },
  methods: {
    startLoader() {
			this.myloader = this.$loading.show({ canCancel: false, color:'#34749B' });
		},
		stopLoader() {
			this.myloader.hide();
    },
    handleLogin () {
      this.userError = null
      this.passwordError = null
      this.$store.dispatch(SET_SUCCESS_MSG_ACTION, null)
      this.successMsg = null

      if (this.email.length === 0) {
        this.userError = 'ユーザー名は空にできません。'
      }

      if (this.password.length === 0) {
        this.userError = '正しい情報を入力してください'
      }

      this.startLoader();

      AuthService.login(this.email, this.password)
        .then((user) => {
          this.$store.dispatch(SET_USER_ACTION, user)
          this.$store.dispatch(SET_ISLOGGEDIN_ACTION, true)
          this.stopLoader();
          if (user.challengeName === 'NEW_PASSWORD_REQUIRED') {
            this.$router.push({name: 'change_password'})
          } else {
            // eslint-disable-next-line handle-callback-err
            user.getSession(async (err, result) => {
              if (result) {
              const jwtToken = result.getIdToken().getJwtToken();
              this.$store.dispatch(SET_JWTTOKEN_ACTION, jwtToken)
                window.AWS.config.credentials = new window.AWS.CognitoIdentityCredentials(
                  {
                    IdentityPoolId: awsconfig.aws_cognito_identity_pool_id,
                    Logins: {
                      [process.env.VUE_APP_AWS_COGNITO_POOL_URL]: result
                        .getIdToken()
                        .getJwtToken()
                    }
                  }
                )

                const header = {
                  headers: {
                    'Content-Type': 'application/json'
                  }
                }

                const params = {
                  type: 'create',
                  administratorName: 'motocle',
                  enterpriseId: process.env.VUE_APP_ENTERPRISE_ID
                }

                AuthService.confirmLogin( header, params)
                  .then((result) => {
                    if(result.data.status == false) {
                      this.$store.dispatch(SET_ERROR_MSG_ACTION, result.data.error)
                      this.userError = result.data.error
                      AuthService.logout();
                    }
                    else this.$router.push({name: 'home'})
                  })
              }
            })
          }
        }).catch((err) => {
          if (error.code === 'UserNotFoundException' || error.code === 'NotAuthorizedException' || error.code === 'InvalidParameterException') {
            this.userError = 'メールアドレスまたはパスワードが間違っています'
            // this.userError = 'ユーザーは存在しません。'
          }
          this.stopLoader();
        });
    }
  }
}
</script>

<style scoped>
input { border-style: solid; }
.loading-img{
  position:absolute;
  left:50%;
  top:50%;
  transform:translate(-50%,-50%);
  width: 108.5px;
}
.login-contents{
  padding: 20px 30px;
  margin-top:50px;
  border: 1px solid #ffffff;
  border-radius: 5px;
}
.emailfield >>>.v-input input {
max-height: 34px;
}

.emailfield >>>.v-input__slot{
min-height: 34px !important;
}
.passfield >>>.v-input input {
max-height: 34px;
}

.passfield >>>.v-input__slot{
min-height: 34px !important;
}

.login-contents >>> .v-input--is-focused fieldset{
  border: 1px solid;
  border-color: #00000061;
}


</style>
