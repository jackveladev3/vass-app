<template>
  <div class="text-center">
    <v-dialog
      v-model="dialogue"
      width="470"
      height="330"
    >
      <v-card>
        <v-card-title style="justify-content: center;" class="headline lighten-2 text-center">
          <div class="close-icon">
            <v-icon size="44" color="#979797" @click="close">close</v-icon>
          </div>
          <p class="text-center dialogue-title">{{dialogueTitle}}</p>
          <div style="flex-basis: 100%; height: 0;"></div>
          <p class="text-center">
            <img class="title-icon" src="@/assets/images/icon/PathBlue.png" />
            <!--<v-img class="title-icon" src="@/assets/images/icon/PathBlue.png"></v-img>-->
          </p>
        </v-card-title>
		    <hr class="title-divider">
        <v-card-text class="pl-12">
          <p class='mt-5 sub-title'>
            以下の利用者に入室のURLを送付します。<br>
            メールアドレスを再度ご確認の上送信ボタンを押してください。
          </p>
	        <v-row>
            <v-col cols="6">
              <p class="text-secondary input-label">送付先氏名*</p>
              <v-text-field :rules="required" class="textfield" v-model="name" label=""  height="24" width="170" outlined dense></v-text-field>
              <!--<input
                class="w-full border border-dark input-text"
                v-model="name"
                required
              />-->
	          </v-col>
            <v-col cols="6">
			        <p class="text-secondary input-label">メールアドレス*</p>
              <v-text-field :rules="emailRule.concat(required)" class="textfield" v-model="email" label=""  height="24" width="170" outlined dense></v-text-field>
              <!--<input
                class="w-full border border-dark input-text"
                v-model="email"
                required
              />-->
	          </v-col>
	        </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
		  	    class="mr-4 mb-4"
            width="98"
            height="30"
            color="#34749B"
            dark
            :disabled="dialogueButtonDisabled"
            @click="resendEmail()"
          >
  	        送信
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import * as adminService from '@/services/admin';
import * as tutorService from '@/services/tutor';
import * as studentService from '@/services/student';

export default {
  props: {
    userType: String
  },
  data () {
    return {
      dialogue: false,
      dialogueTitle: 'メールの再送',
      dialogueButtonDisabled: false,
      name: '',
      email: '',
      resendData: {},
      rules: {
        email: [val => (val || '').length > 0 || 'This field is required'],
        name: [val => (val || '').length > 0 || 'This field is required']
      },
      required:[v => v != '' || 'Field is required'],
      emailRule:[v => !v || /.+@.+\..+/.test(v) || 'E-mail must be valid'],
    }
  },
  methods: {
    validateEmail(emailField){
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(emailField).toLowerCase());
    },
    toggleDialogue (resendData) {
      this.dialogue = true;
      this.resendData = resendData;
      this.name = resendData.name;
      this.email = resendData.email;
		},
		close() {
			this.dialogue = false;
      this.dialogueButtonDisabled = false;
		},
    resendEmail () {
      if(!this.validateEmail(this.email))
      {
        return false;
      }
      this.dialogueButtonDisabled = true;
      let data = {
        userId: this.resendData.userId,
        lectureId: this.resendData.lectureId
      }

      let result;

      if(this.userType === 'admin') {

        adminService.resendEmail(data)
          .then((result) => {
            this.dialogueTitle = 'メール送付完了'
          }).catch((err) => {
            console.error(err)
            this.dialogue = false;
          });

      } else if(this.userType === 'tutor') {

        tutorService.resendEmail(data)
          .then((result) => {
            this.dialogueTitle = 'メール送付完了'
          }).catch((err) => {
            console.error(err)
            this.dialogue = false;
          });
      }
    }
  }
}
</script>

<style scoped>
.dialogue-title {
	font-size:16px;
	margin-bottom:8px;
	color: #34749B;
}

.close-icon {
	position: absolute;
	top: 0px;
	right: 0px;
}

.close-icon >>> .v-icon {
	-webkit-text-stroke: 1px white;
}

.v-card {
	overflow: hidden;
}

.title-divider {
	border-top: 2px solid #7A7A7A;
    opacity: 50%;
	margin-bottom: 40px;
}

.sub-title {
	color: #7F7F7F;
	font-size: 12px;
	font-weight: 500;
	margin-bottom: 8px;
}

.input-label {
	color: #979797;
	font-size: 8px;
	margin-bottom: 0px;
}

.input-text {
	background: #FFFFFF;
	border: 1px solid #979797;
	box-sizing: border-box;
	box-shadow: inset 0px 1px 3px rgba(0, 0, 0, 0.5);
	border-radius: 1px;
	font-size: 9px;
    color: #4A4A4A;
	padding-left: 5px;
	height: 16px;
	width: 184px;
}

.v-dialog {
	border-radius: 10px;
}
.textfield >>>.v-input input {
max-height: 24px;
max-width:170px;
width:170px !important;
background-color: red !important;
}

.textfield >>>.v-input__slot{
min-height: 24px !important;
min-width:170px !important;
width:170px !important;
}
.textfield >>>.v-text-field{
      width: 170px !important;
}
.textfield >>>.v-text-field__details{
    margin-bottom: 0px !important;
      margin-top:0px !important;
}
.theme--dark.v-btn.v-btn--disabled:not(.v-btn--flat):not(.v-btn--text):not(.v-btn--outlined){
  background-color: #34749B !important;
  color:white !important;
}
</style>
