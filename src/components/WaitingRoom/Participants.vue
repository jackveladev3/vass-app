<template>

  <div>
    <div class="participants-wrapper">
      <template v-for="(item, index) in participants">
        <div class="participant-item" :key="index">
          <div class="participant-name">
            {{item.name}}
            <div v-if="item.userType === 'student'" class='float-right' style="width: 50px;">
              <div class='float-right'>
                <img
                  class="resend-icon"
                  @click.stop="resendInvitation(item)"
                  src="@/assets/images/icon/Path.png"
                  v-if="isOpen"
                />
                <img
                  class="whiteboard-icon"
                  @click.stop="openWhiteBoard(item)"
                  src="@/assets/images/icon/whiteboard.svg"
                  v-else-if="!isOpen"
                />
              </div>
              <div class='float-right'>
                <img
                  class="select-material-icon"
                  @click.stop="onSelectMaterials(item)"
                  src="@/assets/images/icon/Shape.png"
                />
              </div>
            </div>
          </div>
          <div class="participant-url-title">入室用URL</div>
          <div @click="handleCopyLink(item.lectureUrl)" class="participant-url">{{item.lectureUrl}}</div>
        </div>
      </template>
    </div>

    <UploadMaterial
      :name="'select-material-modal'"
      :url="url"
      :lectureId="lectureId"
      :studentId="curStudentId"
      :uploaded="studentMaterials"
      :lecture="lecture"
      :userType="userType"
    />

    <WhiteBoardImg
      :name="'whiteboard-modal'"
      :whiteBoardMaterials="whiteBoardMaterials ? whiteBoardMaterials.map(item => {
        return `${baseAssetsUrl}/${enterPriseId}/lectures/${lectureId}/${studentId}/sharedBoards/${item}`;
      }) : []"
      :username="selectedUser"
    />

    <ResendInvitation ref="resendInvitationRef" :userType="userType"/>

  </div>

</template>

<script>
import UploadMaterial from '@/components/lecture/upload/UploadMaterial';
import ResendInvitation from '@/components/WaitingRoom/ResendInvitation';
import WhiteBoardImg from '@/components/lecture/whiteboard/WhiteBoardImg';
import { SET_LECTURE_ACTION } from '@/store/actionTypes';
import { mapState } from 'vuex';
import * as adminService from '@/services/admin';
import * as tutorService from '@/services/tutor';

export default {
  name: 'Participants',
  props: {
    participants: Array,
    userType: String,
    lectureUrlId: String,
    isOpen: Boolean,
  },
  components: {
    ResendInvitation,
    UploadMaterial,
    WhiteBoardImg
  },
  data () {
    return {
      tab: 0,
      curStudentId: '',
      resendInvitationDialogue: false,
      lectureId: this.$route.params.id,
      studentMaterials: [],
      url: '',
      whiteBoardMaterials: [],
      baseAssetsUrl: process.env.VUE_APP_AWS_S3_BASE_URL,
      enterPriseId: '',
      selectedUser: ''
    }
  },
  computed: {
    ...mapState({
      lecture: state => state.lecture.lecture
    })
  },
  methods: {
    onSelectMaterials(item) {
      this.setLecture(this.lectureUrlId);
      this.curStudentId = item.userId;
      this.url = item.lectureUrl;
      this.$modal.show('select-material-modal');
    },
    openWhiteBoard(item) {
      this.url = item.lectureUrl;
      this.$modal.show('whiteboard-modal');
      this.viewWhiteBoard(this.lectureUrlId, item);
    },
    handleCopyLink(url) {
      navigator.clipboard.writeText(url);
    },
    resendInvitation(item) {
      this.resendInvitationDialogue = true;
      this.$refs.resendInvitationRef.toggleDialogue(item);
    },
    async setLecture (lectureId) {

      // let uri = `/${this.userType}/getLecture/${lectureId}`;
      let result;

      if(this.userType === 'admin') {
        result = await adminService.getAdminLecture(lectureId);
      } else if(this.userType === 'tutor') {
        result = await tutorService.getTutorLecture(lectureId);
      }

      if(result) {
        let tempArr = {
          ...this.lecture,
          id: result.data.lectureId,
          startTime: result.data.startTime,
          endTime: result.data.endTime,
          students: [],
        }

        this.studentMaterials = result.data.lectureDetails.filter(item => item.userId === this.curStudentId).map(item => item.uploaded)[0];
        this.lectureId = result.data.lectureId;

        for (const user of result.data.lectureDetails) {
          if (user.userType === 0) {
            tempArr.tutor = {
              id: user.info.tutorId,
              familyName: user.info.tutorFamilyName,
              givenName: user.info.tutorFirstName,
              email: user.info.email,
              emailSent: false,
              lectureURL: user.lectureUrl
            }
          } else if (user.userType === 1) {
            const workbooks = []
            for (const workbook of user.workbooks) {
              workbooks.push({
                id: workbook.id,
                pageId: [...workbook.pageId]
              })
            }

            tempArr.students.push({
              id: user.info.studentId,
              familyName: user.info.studentFamilyName,
              givenName: user.info.studentName,
              email: user.info.email,
              emailSent: false,
              lectureURL: user.lectureUrl,
              workbooks: workbooks,
              uploaded: user.uploaded,
              sharedBoards: user.sharedBoards
            });
          }
        }

        this.url = `${process.env.VUE_APP_DOMAIN}/classroom/teacher/${tempArr.tutor.lectureURL}/upload`;
        this.$store.dispatch(SET_LECTURE_ACTION, tempArr);
        this.loading = false;
      }
    },
    async viewWhiteBoard(lectureId, item) {

      let result;

      if(this.userType === 'admin') {
        result = await adminService.getAdminLecture(lectureId);
      } else if(this.userType === 'tutor') {
        result = await tutorService.getTutorLecture(lectureId);
      }

      if(result) {
        this.lectureId = result.data.lectureId;
        this.enterPriseId = result.data.enterpriseId;
        this.studentId = item.userId;
        this.selectedUser = item.name;
        this.whiteBoardMaterials = result.data.lectureDetails.filter(user => user.userType === 1 && user.userId === item.userId)[0].sharedBoards;
        this.loading = false;
      }
    }
  }
}
</script>

<style scoped>
.v-list-item {
  background-color: white !important;
}

.participants-wrapper {
  margin-left: 4px;
  margin-right: 4px;
}

.participant-item {
  background: #F8F8F8;
  padding: 8px;
  margin-bottom: 6px;
  color: #898989;
  border-radius: 3.5px;
}

.participant-name {
  font-size: 12px;
  margin-bottom: 4px;
  font-weight: 600;
}

.participant-url-title {
  font-size: 9px;
  font-weight: 600;
}

.participant-url {
  cursor: pointer;
  font-size: 8px;
}

.resend-icon {
  margin-left: 6px;
  cursor: pointer;
  width: 14px;
  height: 14px;
}

.whiteboard-icon {
  margin-left: 6px;
  cursor: pointer;
  width: 14px;
  height: 14px;
}

.select-material-icon {
  cursor: pointer;
  width: 12px;
  height: 14px;
}

</style>
