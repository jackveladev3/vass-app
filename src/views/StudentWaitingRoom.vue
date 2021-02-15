<template>
<div>
  <div class="w-full" v-if="!isExpired">
    <div
      class="w-full"
      style="marginTop:56px;paddingLeft:20.5px;paddingTop:28px;paddingBottom:5px;"
    >
    </div>

    <v-container>
      <v-row>
        <v-col lg="3" md="3" cols="12">
          <v-card
            class="left-side_box"
            style=" border-top-left-radius: 8px !important; border-top-right-radius: 8px !important;"
          >
            <v-row class="tab-header">
              <v-col
                class="tab-title tab-title-left"
                :class="{'active' : tab === 0}"
                @click="tab = 0"
              >
                <i class="fas fa-book"/>
                本日の教材
              </v-col>
              <v-col
                class="tab-title tab-title-right"
                :class="{'active' : tab === 1}"
                @click="tab = 1"
              >
                <i class="fas fa-camera"/>
                写真
              </v-col>
              <v-col
                class="tab-title tab-title-right"
                :class="{'active' : tab === 3}"
                @click="tab = 3"
                v-if="!isOpen"
              >
                <i class="fas fa-laptop"></i>
                ボード
              </v-col>
            </v-row>
            <v-virtual-scroll
              v-if="tab === 0"
              :items="assignedWorkbooks"
              :item-height="150"
              :height="'calc( 100% )'"
            >
              <template v-slot="{ index, item }">
                <v-img
                  :src="`${baseAssetsUrl}/${item}`"
                  alt="lecture"
                  height="120"
                  class="workbook-material-icon"
                  @click="openWorkbookMaterialModal(index)"
                ></v-img>
              </template>
            </v-virtual-scroll>
            <div
              v-if="tab === 1"
              class="pa-7"
              style="padding-bottom: 0 !important; padding-top: 0 !important; height: 100%"
            >
              <div class="upload-panel">
                <p>
                  <v-btn
                    rounded
                    @click="$modal.show('select-material-modal')"
                  >
                    アップロード
                  </v-btn>
                </p>
                <p>スマホからアップロードする場合</p>
                <VueQrcode
                  :value="url"
                  :options="{ width: 94 }"
                  style="margin: 0 auto;"
                />
              </div>

              <div class="student-materials" style="height: calc(100% - 233px); overflow: auto; margin-top: 15px;">
                <v-row v-for="(item, index) in studentMaterials" style="display: flex; justify-content: center;" :key="index">
                  <v-badge
                    left
                    tile
                    overlap
                    :content="index + 1"
                    color="grey"
                    class="student-material"
                  >
                    <v-img
                      class="student-img-list"
                      :src="imgSrc(item)"
                      alt="Material"
                      @click="openStdMatModal(index)"
                    ></v-img>
                  </v-badge>
                </v-row>
              </div>
            </div>
          </v-card>
        </v-col>
        <v-col lg="9" md="9" cols="12">
          <v-card>
            <div class="lecture-header">
              <div>
                {{ lectureTime }}
              </div>

              <v-btn
                depressed
                class="enter-lecture-btn"
              >
                <img src="@/assets/images/icon/door.png" alt="" style="margin-right: 8px;">入室
              </v-btn>
            </div>
          </v-card>

          <Messaging
            v-if="lectureId != ''"
            :lectureId="lectureId"
            :userId="studentId"
            userType="1"
          />
        </v-col>
      </v-row>
    </v-container>

    <MaterialGallery
      :name="'workbooks-gallery-modal'"
      :galleryItems="assignedWorkbooks.map(item => { return `${baseAssetsUrl}/${item}`})"
      :lectureId="lectureId"
      v-if="lectureId != ''"
      ref="workbookMaterialRef"
    />

    <MaterialGallery
      :name="'material-gallery-modal'"
      :galleryItems="studentMaterials.map(item => { return `${baseAssetsUrl}/${this.enterPriseId}/lectures/${lectureId}/${studentId}/${item}`})"
      :lectureId="lectureId"
      v-if="lectureId != ''"
      ref="materialRef"
    />

    <UploadMaterial
      v-if="lectureId != ''"
      :name="'select-material-modal'"
      :url="url"
      :lectureId="lectureId"
      :studentId="studentId"
      :uploaded="studentMaterials"
      :setUploadedMaterials="onSetUploadedMaterials"
      :lecture="lecture"
      :userType="'student'"
    />
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
import MaterialGallery from '@/components/lecture/upload/MaterialGallery';
import Messaging from '@/components/WaitingRoom/Messaging';
import UploadMaterial from '@/components/lecture/upload/UploadMaterial';
import VueQrcode from '@chenfengyuan/vue-qrcode';
import { mapState } from 'vuex';
import * as studentService from '@/services/student';
import { SET_LECTURE_ACTION } from '@/store/actionTypes';
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';

Vue.use(Loading)

export default {
  name: 'StudentWaitingRoom',
  components: {
    MaterialGallery,
    Messaging,
    UploadMaterial,
    VueQrcode
  },
  data () {
    return {
      isExpired: false,
      baseAssetsUrl: process.env.VUE_APP_AWS_S3_BASE_URL,
      enterPriseId: process.env.VUE_APP_ENTERPRISE_ID,
      lectureId: '',
      studentId: '',
      stdName: '',
      lectureTime: '',
      url: '',
      tab: 0,
      curWorkbooksIndex: 0,
      curMatIndex: 0,
      lectureUrl: '',
      assignedWorkbooks: [],
      studentMaterials: [],
      isOpen: true,
      myloader:'',
    }
  },
  created () {
    this.lectureUrl = this.$route.params.url;
    this.url = `${process.env.VUE_APP_DOMAIN}/classroom/student/${this.lectureUrl}/upload`;
    this.initialize(this.$route.params.url);
  },
  computed: {
    ...mapState({
      lecture: state => state.lecture.lecture
    })
  },
  methods: {
    startLoader() {
			this.myloader = this.$loading.show({ canCancel: false, color:'#34749B'});
		},
		stopLoader() {
			this.myloader.hide();
		},
    openWorkbookMaterialModal (id) {
      this.$modal.show('workbooks-gallery-modal')
      this.$refs.workbookMaterialRef.setInitialIndex(id)
    },
    imgSrc (item) {
      return `${this.baseAssetsUrl}/${process.env.VUE_APP_ENTERPRISE_ID}/lectures/${this.lectureId}/${this.studentId}/${item}`
    },
    openStdMatModal (id) {
      this.$modal.show('material-gallery-modal')
      this.$refs.materialRef.setInitialIndex(id)
    },

    async initialize (lectureURLId) {

      this.startLoader();

      let result = await studentService.getStudentLecture(lectureURLId);

      if(result) {
        this.stopLoader();
        if(result.data.message === 'Lecture url is invalid / expired') {
          this.isExpired = true;
        } else {

            this.lectureId = result.data.lectureId;
            this.studentId = result.data.lectureDetails[0].info.studentId;
            this.stdName = result.data.lectureDetails[0].info.studentName;
            this.studentMaterials = result.data.lectureDetails[0].uploaded;
            this.lectureTime = `${result.data.startTime} ${result.data.endTime.slice(11)}`;

            if(Date.parse(result.data.endTime) - Date.parse(new Date()) < 0) {
              this.isOpen = false;
            }

            this.assignedWorkbooks = result.data.lectureDetails[0].workbooks.map(v => v.pageId).flat();

            let tempArr = {
              ...this.lecture,
              id: result.data.lectureId,
              startTime: result.data.startTime,
              endTime: result.data.endTime,
              students: []
            }

            for (const user of result.data.lectureDetails) {
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
                uploaded: user.uploaded
              });
            }
            this.$store.dispatch(SET_LECTURE_ACTION, tempArr);
          }
        }

    },

    onSetUploadedMaterials (materials) {
      this.studentMaterials = materials;
    }
  }
}
</script>

<style scoped>
  .container {
    max-width: 100%;
  }

  .row {
    margin-right: 0;
    margin-left: 0;
  }

  .tab-header {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    background-color: #EBF5FA;
    padding: 4px;
    border-radius: 8px 8px 0px 0px;
  }

  .tab-title {
    font-size: 12px;
    background: #EBF5FA;
    height: 22px;
    text-align: center;
    padding: 2px;
    cursor: pointer;
    color: #34759C;
  }

  .tab-title-left {
    border-radius: 8px 3px 3px 3px;
  }

  .tab-title-right {
    border-radius: 3px 8px 3px 3px;
  }

  .active {
    background: #34759C;
    color: white;
  }

  .workbook-material-icon {
    width: 200px;
    height: 140px;
    object-fit: cover;
    margin: auto;
    margin-top: 5px;
  }

  .left-side_box {
    height: calc(95vh - 110px);
    padding-top: 40px;
  }

  .upload-panel {
    background: #F6F6F6;
    border-radius: 3px;
    text-align: center;
    font-size: 12px;
    padding: 12px 12px 16px 12px;
  }

  .upload-panel img {
    margin: 0 auto;
  }

  .student-materials {
    margin-top: 24px;
    padding: 6px 60px;
  }

  .student-material {
    margin-bottom: 36px;
  }

  .lecture-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 16px;
  }

  .enter-lecture-btn {
    background-color: #57A9CA !important;
    border: 1px solid #FFFFFF !important;
    box-sizing: border-box !important;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.5) !important;
    border-radius: 3px !important;
    color: white !important;
  }

  .student-img-list {
    width: 140px;
    height: 140px;
    object-fit: cover;
  }
</style>
