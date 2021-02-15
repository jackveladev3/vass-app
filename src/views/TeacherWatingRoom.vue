<template>
<div>
  <div class="w-full" v-if="!isExpired">
    <div
      class="w-full"
      style="
        margin-top: 80px;
        paddingleft: 20.5px;
        paddingtop: 8px;
        paddingbottom: 5px;
      "
    >
    </div>

    <v-container>
      <v-row>
        <v-col lg="3" md="3" cols="12">
          <v-card :height="'100%'">
            <div class="pa-1" style="padding-bottom: 32px !important">
              <p
                style="
                  color: #858585;
                  font-size: 14px;
                  font-weight: 600;
                  margin-top: 8px;
                  margin-bottom: 8px;
                  margin-left: 4px;
                "
              >
                参加者一覧
              </p>

              <Participants
                :participants="participants"
                :lectureUrlId="lectureUrlId"
                :userType="'tutor'"
                :isOpen="isOpen"
              />
            </div>
          </v-card>
        </v-col>
        <v-col lg="9" md="9" cols="12">
          <v-card>
            <div class="lecture-header">
              {{ lectureTimeString }}
            </div>
          </v-card>

          <Messaging
            v-if="lectureId != '' && userId != ''"
            :lectureId="lectureId"
            :userId="userId"
            userType="0"
          />
        </v-col>
      </v-row>
    </v-container>
  </div>
  <div v-else-if="isExpired"
    class="w-full"
    style="
      margin-top: 80px;
      paddingleft: 20.5px;
      paddingtop: 8px;
      paddingbottom: 5px;
      display: flex;
      min-height: 600px;
    "
  >
    <h2 style="margin: auto; text-align: center;">URLの期限が切れました。</h2>
  </div>
</div>
</template>

<script>
import Vue from 'vue';
import Messaging from "@/components/WaitingRoom/Messaging";
import Participants from "@/components/WaitingRoom/Participants";
import * as tutorService from '@/services/tutor';
import moment from "moment";
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
Vue.use(Loading)

export default {
  name: "AdminWaitingRoom",
  components: {
    Messaging,
    Participants,
  },
  data() {
    return {
      isExpired: false,
      participants: [],
      lectureStartTime: "",
      lectureId: "",
      userId: "",
      lectureUrlId: "",
      isOpen: true,
      myloader:'',
    };
  },
  created () {
    this.lectureUrlId= this.$route.params.url;
    this.initialLoad();
  },
  mounted() {
    // this.initialLoad();
  },
  computed: {
    lectureTimeString() {
      if(this.lectureStartTime != '' && this.lectureEndTime != '') {
        const dateStr = moment(this.lectureStartTime).format("YYYY年 MM月 DD日");
        const fromTime = moment(this.lectureStartTime).format("HH:mm");
        const toTime = moment(this.lectureEndTime).format("HH:mm");
        return dateStr + " " + fromTime + " - " + toTime;
      } else {
        return "";
      }
    },
  },
  watch: {

  },
  methods: {
    startLoader() {
			this.myloader = this.$loading.show({ canCancel: false, color:'#34749B' });
		},
		stopLoader() {
			this.myloader.hide();
		},
    async initialLoad() {
      this.loadParticipants();
    },
    async loadParticipants() {
      this.startLoader();

      //  load all tutors
      let result = await tutorService.getTutorLecture(this.$route.params.url);

      if(result) {
        this.stopLoader();
        if(result.data.message === 'Lecture url is invalid / expired') {
          this.isExpired = true;
        } else {
            this.lectureStartTime = result.data.startTime;
            this.lectureEndTime = result.data.endTime;
            this.lectureId = result.data.lectureId;
            if(Date.parse(result.data.endTime) - Date.parse(new Date()) < 0) {
              this.isOpen = false;
            }
            const tutors = [];
            const students = [];

            for (const user of result.data.lectureDetails) {
              if (user.userType === 0) {
                tutors.push({
                  name: user.info.tutorFamilyName + ' ' + user.info.tutorFirstName,
                  lectureUrl: `${process.env.VUE_APP_DOMAIN}/classroom/teacher/${user.lectureUrl}`,
                  userId: user.userId,
                  email: user.info.email,
                  lectureId: this.lectureId,
                  userType: "tutor",
                });
              } else if (user.userType === 1) {
                students.push({
                  name: `${user.info.studentFamilyName} ${user.info.studentName}`,
                  lectureUrl: `${process.env.VUE_APP_DOMAIN}/classroom/student/${user.lectureUrl}`,
                  userId: user.userId,
                  email: user.info.email,
                  lectureId: this.lectureId,
                  userType: "student",
                });
              }
            }
            this.userId = tutors[0].userId;
            this.participants = [...tutors, ...students];
          }
        }
    },
  },
};
</script>

<style scoped>
.container {
  max-width: 100%;
}

.row {
  margin-right: 0;
  margin-left: 0;
}

.active {
  background: #34759c;
  color: white;
}

.lecture-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
  font-size: 14px;
  color: #858585;
}

.enter-lecture-btn {
  background-color: #57a9ca !important;
  border: 1px solid #ffffff !important;
  box-sizing: border-box !important;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.5) !important;
  border-radius: 3px !important;
  color: white !important;
}
</style>
