<template>
  <div class="w-full dashboard-wrapper">
    <div class="w-full flex">
      <v-row no-gutters>
      <v-col
        :cols="9"
      >
      <div class="calendar-block">
        <div class="CustomCalendar">
          <div class="text-center section">
            <vc-calendar
              locale="ja-JA"
              class="custom-calendar max-w-full"
              :masks="constant.masks"
              :attributes="attributes"
              @dayclick="dayClicked"
              disable-page-swipe
              is-expanded
              ref="calendar"
              @update:from-page="onMonthPageChange"
            >
              <template
                v-if="attributes.length != 0"
                v-slot:day-content="{ day, attributes }"
              >
                <div
                  v-on:click="dayClicked(day)"
                  class="flex flex-col h-full z-10 overflow-hidden"
                >
                  <div class="flex-grow overflow-y-auto overflow-x-auto">
                    <p
                      v-on:click="dayClicked(attr)"
                      v-for="attr in attributes"
                      class="lecture-infochip"
                      :class="attr.customData.class"
                      :key="attr.key"
                    >
                      {{ attr.customData.time }} {{ dashboardTutorName(attr.customData.tutor) }}
                    </p>
                  </div>
                  <span class="day-label daycell-date">{{ day.day }}</span>
                </div>
              </template>
            </vc-calendar>
          </div>
        </div>
      </div>
      </v-col>

      <v-col :cols="3">
      <div class="calendar-side-block">
        <div class="w-full instruction-block">
          <div class="instruction-block_leftsect">指導一覧</div>
          <div class="instruction-block_rightsect">
            <i class="fas fa-caret-left fa-2x" @click="prevDay" />
            <div class="monthvalue">
              {{ selectedDate.year }}.{{ selectedDate.month + 1 }}.{{
                selectedDate.date
              }}
            </div>
            <i class="fas fa-caret-right fa-2x" @click="nextDay" />
          </div>
        </div>
        <LectureDetail
          v-for="(lecture, index) in calendarData[selectedDate.date - 1]"
          :key="index"
          :lecture="lecture"
          :onEditLecture="handleEditLecture"
          @onLectureEdit="lectureDetail_selectLecture"
        />

        <!--<button
          class="btn text-center align-middle add-outlinebtn"
          @click="handleAddLecture"
        >
          <i class="fas fa-plus" />
          新たに指導を追加
        </button>-->
        <div class="dashbtn">
          <v-btn class="btn text-center align-middle add-outlinebtn" @click="handleAddLecture">
                  <div class="f-18">+</div> 新たに指導を追加
          </v-btn>
        </div>
      </div>
      </v-col>
      </v-row>

    </div>
    <modal name="lecture-modal" :width="500" :height="550">
      <div style="overflow-y: scroll !important" class="no-overflowx">
        <div class="flex items-center w-full headerStepper" style="paddingtop: 8px">
          <div class="row">
            <div class="col-sm-12">
              <h1 class="lecture-modal-title create">指導の追加</h1>
            </div>
            <div class="col-sm-1 cross">
              <button
                style="
                  fontsize: 24px;
                  paddingright: 8px;
                  paddingleft: 8px;
                  marginright: 6px;
                  outline: none;
                "
                @click="$modal.hide('lecture-modal')"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
        <LectureStepper :step="lectureStep" />
        <ManageLecture
          v-if="lectureStep === 1"
          :onNext="() => {this.lectureStep = 2}"
          :onSave="handleSave"
          :onDelete="handleDeleteLecture"
          :isEdit="isEditLecture"
        />
        <ChooseWorkbook
          v-if="lectureStep === 2"
          :onPrev="
            () => {
              this.lectureStep = 1;
            }
          "
          :onSendLink="handleLectureSendLink"
          :isEdit="isEditLecture"
        />
      </div>
    </modal>
    <modal name="confirm-email-modal" :width="500" :height="550">
      <div class="flex flex-col justify-between padding20 step3overflow">
        <div>
          <div
            class="flex flex-col items-center w-full"
            style="paddingtop: 18px"
          >
            <p style="fontSize:16px;marginBottom:8px;color: #34749B;">メール送付完了</p>
            <i class="fas fa-paper-plane fa-2x" style="marginBottom:15px;color: #34749B;" />
          </div>
          <div
            class="w-full"
            style="
              paddingtop: 20px;
              padding: 20px;
              paddingleft: 50px;
              paddingright: 50px
            "
          >
            <LectureURLBox
              :name="lecture.tutor.familyName + ' ' + lecture.tutor.givenName"
              type="teacher"
              :URL="lecture.tutor.lectureURL"
              :emailStatus="lecture.tutor.emailSent"
            />
          </div>
          <div class="w-full">
            <div
              v-for="student in lecture.students"
              :key="'URLBox_' + student.id"
              style="padding: 20px; paddingleft: 50px; paddingright: 50px"
            >
              <LectureURLBox
                :name="student.familyName + ' ' + student.givenName"
                type="student"
                :URL="student.lectureURL"
                :emailStatus="student.emailSent"
              />
            </div>
          </div>
        </div>
        <div
          class="flex justify-end pulltobottom"
          style="marginbottom: 17px; marginright: 14px"
        >
        <v-btn class="text-white bg-button sendbtn" @click="$modal.hide('confirm-email-modal')">閉じる</v-btn>
        </div>
      </div>
    </modal>
    <modal
      name="lecture-details-modal"
      class="dashlecture-detail-modal"
      :width="470"
      :height="550"
    >
      <div class="modal-header">
        <p class="lecture-modal-title">指導詳細</p>
        <button class="close-btn" @click="$modal.hide('lecture-details-modal')">
          ✕
        </button>
      </div>
      <div class="modal-body w-full">
        <div class="flex tab-row">
          <button
            :class="{
              active: lectureDetailsModal.tabVisible === 'lecture-details',
            }"
            @click="lectureDetail_switchTab('lecture-details')"
          >
            指導詳細
          </button>
          <button
            :class="{
              active: lectureDetailsModal.tabVisible === 'participants-details',
            }"
            @click="lectureDetail_switchTab('participants-details')"
          >
            参加生徒
          </button>
        </div>
        <div class="flex content-row tab-section">
          <div
            v-if="lectureDetailsModal.tabVisible === 'lecture-details'"
            class="tabs_inner"
          >
            <div class="tabs_inner_firstsect">
              <div class="lecture-info">
                <h2 class="lecture-info">指導日時</h2>
                <p>
                  <span>{{
                    lectureDetailsModal.selectedLecture.lectureDate
                  }}</span>
                </p>
              </div>

              <div class="dateblock">
                <div class="lecture-info">
                  <h2 class="lecture-info">開始時刻</h2>
                  <p>
                    <span>{{
                      lectureDetailsModal.selectedLecture.lectureStartTime
                    }}</span>
                  </p>
                </div>

                <div class="seprator"></div>

                <div class="lecture-info">
                  <h2 class="lecture-info">終了時刻</h2>
                  <p>
                    <span>{{
                      lectureDetailsModal.selectedLecture.lectureEndTime
                    }}</span>
                  </p>
                </div>
              </div>

              <div class="lecture-info">
                <h2 class="lecture-info">講師名</h2>
                <p>
                  <span>{{ lectureDetailsModal.selectedLecture.tutor }}</span>
                </p>
              </div>
            </div>
            <div class="tabs_inner_lastsect delete-lecture">
              <v-btn class="text-white delete-btn" @click="handleDeleteLecture()" >授業を削除</v-btn>
              <!--<button class="delete-btn" @click="handleDeleteLecture()">
                授業を削除
              </button>-->
            </div>
          </div>
          <div v-if="lectureDetailsModal.tabVisible === 'participants-details'" class="student-list">
            <div
              class="participant"
              v-for="(student, index) in lectureDetailsModal.selectedLecture.students"
              :key="index"
            >
              <div class="participant-header">
                <i class="fas fa-user fa-2x" />
                {{ student.familyName + " " + student.givenName }}
              </div>
              <div class="participant-info">
                <p
                  v-for="(workbook, index1) in student.workbooks"
                  :key="index1"
                >
                  <b>
                    {{ workbook.workbookJapaneseName }}: <span v-for="(page, index2) in workbook.pageId" :key="index2">No {{page.split('/')[page.split('/').length-1].split('.')[0] + `${index2 !== workbook.pageId.length - 1 ? ', ' : ''}`}}</span>
                  </b> <br>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </modal>
    <modal
      name="lecture-delete-modal"
      class="dashlecture-delete-modal"
      :width="430"
      :height="140"
    >
      <div class="modal-body w-full">
        <p class="text-center">本当に削除しますか</p>
        <div class="flex justify-center">
          <!--<button class="cancel-small-btn" @click="handleCancelDeleteLecture">
            キャンセル
          </button>-->
          <v-btn class="text-white cancel-small-btn" @click="handleCancelDeleteLecture">キャンセル</v-btn>
          <v-btn class="text-white delete-small-btn" @click="handleConfirmDeleteLecture">指導を削除</v-btn>
          <!--<button class="delete-small-btn" @click="handleConfirmDeleteLecture">
            指導を削除
          </button>-->
        </div>
      </div>
    </modal>
  </div>
</template>

<script>
import moment from "moment";
import Vue from 'vue';
import LectureDetail from "@/components/calendar/LectureDetail";
import LectureStepper from "@/components/lecture/LectureStepper";
import ManageLecture from "@/components/lecture/ManageLecture";
import ChooseWorkbook from "@/components/lecture/ChooseWorkbook";
import LectureURLBox from "@/components/lecture/LectureURLBox";
import CommonService from '@/services/common';
import * as adminService from '@/services/admin';
import * as studentService from '@/services/student';
import { SET_LECTURE_ACTION, CLEAR_LECTURE_ACTION } from '@/store/actionTypes';
import { mapState } from 'vuex';
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
import Constant from '@/services/constants';

Vue.use(Loading)

export default {
  name: "Dashboard",
  components: {
    LectureDetail,
    LectureStepper,
    ManageLecture,
    ChooseWorkbook,
    LectureURLBox
  },
  data() {
    return {
      constant: Constant,
      currentDate: {
        year: 0,
        month: 0,
        date: 0,
      },
      selectedDate: {
        year: 0,
        month: 0,
        date: 0,
      },
      todayDate: 0,
      dayOfFirstDate: 0,
      dates: 0,
      calendarData: [],
      customCalendarData: [],
      lectureStep: 1,
      lectureTutorEmailSent: false,
      isEditLecture: false,
      selectedDay: null,
      lectureDetailsModal: {
        tabVisible: "lecture-details",
        selectedLecture: {},
      },
      myloader:'',
    };
  },
  mounted() {
    const today = new Date();
    this.currentDate = {
      year: today.getFullYear(),
      month: today.getMonth(),
      date: today.getDate(),
    };
    this.selectedDate = this.currentDate;
    this.todayDate = today.getDate();
    this.dayOfFirstDate = today.getDay();

    //document.getElementsByClassName('vm--modal')[0].style.overflowY ="scroll";
  },
  computed: {
    ...mapState({
      lecture: state => state.lecture.lecture
    }),
    lectureTutorString() {
      return (
        this.lectureDetailsModal.selectedLecture.tutor.familyName +
        " " +
        this.lecture.tutor.givenName +
        " 先生"
      );
    },
    attributes() {
      return [
        // Attributes for todos
        ...this.customCalendarData.map((todo) => ({
          key: todo.id,
          dates: todo.start,
          customData: { time: moment(todo.start).format("HH:mm"), ...todo },
          // highlight: true,
        })),
      ];
    },
  },
  methods: {
    startLoader() {
			this.myloader = this.$loading.show({
                        canCancel: false,
                        color:'#34749B',
                      });
		},
		stopLoader() {
			this.myloader.hide();
		},
    async initialLoad() {
      this.loadMonthData();
    },
    async uploadFiles(lectureId) {

      for (const student of this.lecture.students) {
        if (!('uploaded' in student)) {
          return false
        }

        const data = {
          enterpriseId: process.env.VUE_APP_ENTERPRISE_ID,
          lectureId: lectureId,
          studentId: student.id,
          fileData: student.uploaded.filesToUpload
                    .map(element => {
                      return {
                        contentType: `image/${element.file.name.split('.').pop().toLowerCase()}`,
                        fileName: element.file.name
                      }
                    })
        }

        let result = await studentService.uploadImg(data);

        if(result) {
          const params = {
            studentId: student.id,
            lectureId: lectureId,
            uploaded: result.data.files.map(item =>  `${item.fileName}`)
          }

          let response = studentService.updateUploaded(params);

          result.data.files.forEach((v, i) => {
              CommonService.axiosPutRequest(v.signedUrl, student.uploaded.filesToUpload[i].file).then(() => {
            });
          });
        }
      }
    },
    dashboardTutorName(tutor) {
      const contentWidth = window.innerWidth;
      let result;
      if(contentWidth >= 1500) {
        result = tutor.slice(0, parseInt(contentWidth / 150)) + (tutor.length > parseInt(contentWidth / 150) ? '...' : '');
      } else if(contentWidth < 1500) {
        result = tutor.slice(0, parseInt(contentWidth / 180)) + (tutor.length > parseInt(contentWidth / 180) ? '...' : '');
      } else if(contentWidth < 1200) {
        result = tutor.slice(0, parseInt(contentWidth / 190)) + (tutor.length > parseInt(contentWidth / 190) ? '...' : '');
      }
      return result;
    },
    async handleLectureSendLink() {
      let oldStudents = [];
      let oldTutor = "";
      if (this.isEditLecture) {
        oldStudents = this.lecture.students.map((student) => student.id);
        oldTutor = this.lecture.tutor.id;
      }

      if (this.isEditLecture) {
        for (let i = 0; i < oldStudents.length; i++) {
          const oldStudent = oldStudents[i];
          for (const student of this.lecture.students) {
            if (oldStudent === student.id) {
              oldStudents.splice(i, 1);
              break;
            }
          }
        }

        if (oldTutor === this.lecture.tutor.id) {
          oldTutor = "";
        }
      }

      this.startLoader();
      const data = {
        enterpriseId: process.env.VUE_APP_ENTERPRISE_ID,
        lectureId: this.lecture.id,
        startTime: this.lecture.startTime,
        endTime: this.lecture.endTime,
        students: this.lecture.students.map((student) => ({
          id: student.id,
          workbooks: student.workbooks.map((workbook) => ({
            id: workbook.id,
            pageId: workbook.pageId.map(item => (
              item.path.split("/").pop()
            ))
          }))
        })),
        tutor: this.lecture.tutor.id
      };

      const body = this.isEditLecture
        ? {
            ...data,
            contentUpdated: 1,
            oldStudents,
            oldTutor,
          }
        : data;

      let result = "";

      if (this.isEditLecture) {
        result = await adminService.adminUpdatelecture(body);
      } else {
        result = await adminService.adminCreateLecture(body);
      }
      if(result) {
        this.stopLoader();
        this.uploadFiles(result.data.lectureId);

        let tempObj = JSON.parse(JSON.stringify(this.lecture));
        tempObj.id = result.data.lectureId;
        tempObj.tutor.emailSent = result.data.tutorEmailSent == 1 ? true : false;
        tempObj.tutor.lectureURL = result.data.tutorLectureUrl;
        /*let tempObj = {
          ...this.lecture,
          id: result.data.lectureId,
          tutor: {
            ...this.lecture.tutor,
            emailSent: result.data.tutorEmailSent == 1 ? true : false,
            lectureURL: result.data.tutorLectureUrl
          }
        }*/

        for (const student of result.data.students) {
          for (const cstudent of tempObj.students) {
            if (student.id === cstudent.id) {
              cstudent.emailSent = student.emailSent == 1 ? true : false;
              cstudent.lectureURL = student.lectureUrl;
              break;
            }
          }
        }

        this.$store.dispatch(SET_LECTURE_ACTION, tempObj);

        this.$modal.hide("lecture-modal");
        this.$modal.show("confirm-email-modal");

        //  apply to calendar
        if (this.isEditLecture) {
          let updateIndex = -1;
          for (
            let i = 0;
            i < this.calendarData[this.currentDate.date - 1].length;
            i++
          ) {
            const lecture = this.calendarData[this.currentDate.date - 1][i];
            if (lecture.id === this.lecture.id) {
              updateIndex = i;
              break;
            }
          }

          if (updateIndex !== -1) {
            this.calendarData[this.currentDate.date - 1][updateIndex] = {
              id: this.lecture.id,
              start: this.lecture.startTime,
              end: this.lecture.endTime,
              tutor: this.lecture.tutor.familyName + " " + this.lecture.tutor.givenName,
              students: this.lecture.students.map(
                (student) => ({
                  familyName: student.familyName,
                  givenName: student.givenName,
                  email: student.email,
                  id: student.id,
                  lectureUrl: student.lectureUrl,
                  lectureUrlUniqueId: student.lectureUrlUniqueId,
                  workbooks: student.workbooks.map((workbook) => ({
                    id: workbook.id,
                    workbookJapaneseName: workbook.workbookJapaneseName,
                    workbookName: workbook.workbookName,
                    pageId: workbook.pageId.map(item => (
                      item.path.split("/").pop()
                    ))
                  }))
                })
              ),
            };
            this.$forceUpdate();
          }
        } else {
          const date = moment(result.data.startTime).date();
          let dateNow = moment(new Date(), "MM-DD-YYYY HH:MM");
          let lectureEndTime = moment(result.data.endTime);
          let lectureData = {
            id: this.lecture.id,
            start: result.data.startTime,
            end: result.data.endTime,
            tutor: this.lecture.tutor.familyName + " " + this.lecture.tutor.givenName,
            students: this.lecture.students.map(
              (student) => ({
                familyName: student.familyName,
                givenName: student.givenName,
                email: student.email,
                id: student.id,
                workbooks: student.workbooks.map((workbook) => ({
                  id: workbook.id,
                  workbookJapaneseName: workbook.workbookJapaneseName,
                  workbookName: workbook.workbookName,
                  pageId: workbook.pageId.map(item => (
                    item.path.split("/").pop()
                  ))
                }))
              })
            ),
            class:
              lectureEndTime.diff(dateNow) > 0 ? "upcominglecture-chip" : "",
          };
          this.calendarData[date - 1].push(lectureData);
          this.customCalendarData.push(lectureData);
        }
      }
    },
    async loadMonthData() {
      this.startLoader();
      const lectureData = [];
      this.dates = new Date(
        this.currentDate.year,
        this.currentDate.month + 1,
        0
      ).getDate();
      const year = this.currentDate.year;
      const monthNumber = this.currentDate.month + 1;
      const day = null;

      let response = await adminService.getAdminLectures(`${monthNumber}/${day}/${year}`);

      if (response) {
        let result = response.data;
        for (const lecture of result) {
          let tutor = "";
          const students = [];
          for (const user of lecture.lectureDetails) {
            if (user.userType === 0) {
              tutor =
                user.info.tutorFamilyName + " " + user.info.tutorFirstName;
            }
            if (user.userType === 1) {
                students.push({
                familyName: user.info.studentFamilyName,
                givenName: user.info.studentName,
                id: user.info.studentId,
                lectureUrl: user.lectureUrl,
                workbooks: user.workbooks,
              });
            }
          }
          let dateNow = moment(new Date(), "MM-DD-YYYY HH:MM");
          let lectureEndTime = moment(lecture.endTime);
          lectureData.push({
            id: lecture.lectureId,
            start: lecture.startTime,
            end: lecture.endTime,
            tutor: tutor,
            students: students,
            class: lectureEndTime.diff(dateNow) > 0 ? "upcominglecture-chip" : "",
          });
        }
        this.calendarData = [];
        for (let i = 0; i < this.dates; i++) {
          this.calendarData[i] = [];
        }
        for (let lecture of lectureData) {
          const date = moment(lecture.start).date();
          this.customCalendarData.push(lecture);
          this.calendarData[date - 1].push(lecture);
        }

        this.selectDay();
        this.stopLoader();
      }
    },
    handleAddLecture() {
      if (
        moment().format("YYYY-MM-DD") <=
        moment([
          this.currentDate.year,
          this.currentDate.month,
          this.currentDate.date,
        ]).format("YYYY-MM-DD")
      ) {
        this.isEditLecture = false;

        this.$store.dispatch(CLEAR_LECTURE_ACTION);

        this.lectureStep = 1;
        this.$modal.show("lecture-modal");
      }
    },
    async handleEditLecture(lectureId) {
      this.startLoader();

      let result = adminService.getAdminLecture(lectureId);

      if(result) {
        let tempObj = {
          ...this.lecture,
          id: result.data.lectureId,
          startTime: result.data.startTime,
          endTime: result.data.endTime,
          students: [],
          tutor: {}
        }

        for (const user of result.data.lectureDetails) {
          if (user.userType === 0) {
            tempObj.tutor = {
              id: user.info.tutorId,
              familyName: user.info.tutorFamilyName,
              givenName: user.info.tutorFirstName,
              email: user.info.email,
              emailSent: false,
              lectureURL: user.lectureUrl,
            };
          } else if (user.userType === 1) {
            const workbooks = [];
            for (const workbook of user.workbooks) {
              workbooks.push({
                id: workbook.id,
                pageId: [...workbook.pageId],
              });
            }

            tempObj.students.push({
              id: user.info.studentId,
              familyName: user.info.studentFamilyName,
              givenName: user.info.studentName,
              email: user.info.email,
              emailSent: false,
              lectureURL: user.lectureUrl,
              workbooks: workbooks,
            });
          }
        }

        this.$store.dispatch(SET_LECTURE_ACTION, tempObj);
        this.stopLoader;
        this.isEditLecture = true;
        this.lectureStep = 1;
        this.$modal.show("lecture-modal");
      }
    },
    handleDeleteLecture() {
      this.$modal.show("lecture-delete-modal");
    },
    handleCancelDeleteLecture() {
      this.$modal.hide("lecture-delete-modal");
    },
    async handleConfirmDeleteLecture() {
      this.startLoader();
      let lecture = this.lectureDetailsModal.selectedLecture;

      let result = await adminService.adminDeleteLecture({lectureId: lecture.id});

      if(result) {
        this.$modal.hide("lecture-delete-modal");
        this.$modal.hide("lecture-details-modal");

        const date = moment(lecture.start).date();

        //  apply to UI
        let delIndex = -1;
        for (let i = 0; i < this.calendarData[date - 1].length; i++) {
          const individualLecture = this.calendarData[date - 1][i];
          if (individualLecture.id === lecture.id) {
            delIndex = i;
            break;
          }
        }

        for (let index = 0; index < this.customCalendarData.length; index++) {
          if (this.customCalendarData[index].id === lecture.id) {
            this.customCalendarData.splice(index, 1);
          }
        }

        if (delIndex !== -1) {
          this.calendarData[date - 1].splice(delIndex, 1);
          this.$forceUpdate();
        }

        this.stopLoader();
        this.loadMonthData();
      }
    },
    async handleSave() {
      const oldStudents = this.lecture.students.map((student) => student.id);
      let oldTutor = this.lecture.tutor.id;

      for (let i = 0; i < oldStudents.length; i++) {
        const oldStudent = oldStudents[i];
        for (const student of this.lecture.students) {
          if (oldStudent === student.id) {
            oldStudents.splice(i, 1);
            break;
          }
        }
      }

      if (oldTutor === this.lecture.tutor.id) {
        oldTutor = "";
      }

      this.startLoader();

      let data = {
        enterpriseId: process.env.VUE_APP_ENTERPRISE_ID,
        lectureId: this.lecture.id,
        startTime: this.lecture.startTime,
        endTime: this.lecture.endTime,
        tutor: this.lecture.tutor.id,
        students: this.lecture.students.map((student) => {
          const workbooks = [];
          for (const workbook of student.workbooks) {
            workbooks.push({
              id: workbook.id,
              pageId: [...workbook.pageId],
            });
          }
          return {
            id: student.id,
            workbooks: workbooks,
          };
        }),
        contentUpdated: 0,
        oldStudents,
        oldTutor,
      }

      let result = await adminService.adminUpdatelecture(data);

      if(result) {
        let updateIndex = -1;
        for (
          let i = 0;
          i < this.calendarData[this.currentDate.date - 1].length;
          i++
        ) {
          const lecture = this.calendarData[this.currentDate.date - 1][i];
          if (lecture.id === this.lecture.id) {
            updateIndex = i;
            break;
          }
        }
        if (updateIndex !== -1) {
          this.calendarData[this.currentDate.date - 1][updateIndex] = {
            id: this.lecture.id,
            start: this.lecture.startTime,
            end: this.lecture.endTime,
            tutor: this.lecture.tutor.familyName,
            students: this.lecture.students.map(
              (student) => student.familyName + " " + student.givenName
            ),
          };
          this.$forceUpdate();
        }
        this.stopLoader();
        this.$modal.hide("lecture-modal");
      }
    },
    getDayClass(i) {
      if (i % 7 === 9 - this.dayOfFirstDate) {
        if (i === 30 - this.dayOfFirstDate) {
          return "date-border date-first-border";
        }
        return "date-border";
      }
      if (i === this.currentDate.date) {
        return "bg-curdate";
      } else if (i < this.todayDate) {
        return "bg-disabled-date";
      } else {
        return "";
      }
    },
    prevDay() {
      let selectedMonth = this.selectedDate.month

      let prev = moment(this.selectedDate).subtract(1, "days");

      this.selectedDate = {
        year: moment(prev).year(),
        month: moment(prev).month(),
        date: moment(prev).date(),
      };

      if(selectedMonth != moment(prev).month()){
        const calendar = this.$refs.calendar;
        calendar.move(
          moment({
            year: this.selectedDate.year,
            month: this.selectedDate.month,
            day: this.selectedDate.date,
          }).format(`YYYY-MM-DD`)
        )
      }

      this.selectDay();
    },
    nextDay() {

      let selectedMonth = this.selectedDate.month

      let next = moment(this.selectedDate).add(1, "days");

      this.selectedDate = {
        year: moment(next).year(),
        month: moment(next).month(),
        date: moment(next).date(),
      };

      if(selectedMonth != moment(next).month()){
        const calendar = this.$refs.calendar;
        calendar.move(
          moment({
            year: this.selectedDate.year,
            month: this.selectedDate.month,
            day: this.selectedDate.date,
          }).format(`YYYY-MM-DD`)
        )
      }

      this.selectDay();

    },
    selectDay() {

      if (document.getElementsByClassName("is-today").length > 0) {
        document
          .getElementsByClassName("is-today")[0]
          .classList.remove("is-today");
      }
      if (document.getElementsByClassName("is-selected").length > 0) {
        document
          .getElementsByClassName("is-selected")[0]
          .classList.remove("is-selected");
      }
      let cl = document.getElementsByClassName(
        "id-" +
          this.selectedDate.year +
          "-" +
          (this.selectedDate.month + 1) +
          "-" +
          moment({
          year: this.selectedDate.year,
          month: this.selectedDate.month,
          day: this.selectedDate.date,
        }).format("DD")
      );
      if(cl.length > 0) cl[0].classList.add("is-selected");
    },
    dayClicked(day) {
      let today = new Date();
      const calendar = this.$refs.calendar;
      if (day.attributes) {
        this.selectedDay = day.date;
        this.selectedDate = {
          year: moment(day.date).year(),
          month: moment(day.date).month(),
          date: moment(day.date).date(),
        };
        this.selectDay();
      }
    },
    onMonthPageChange(day) {
      let month = day.month - 1;
      this.currentDate = {
        year: day.year,
        month: month,
      };

     this.selectedDate.month = month

      this.initialLoad();
    },
    lectureDetail_switchTab(selectedTab) {
      this.lectureDetailsModal.tabVisible = selectedTab;
    },
    lectureDetail_selectLecture(lecture) {
      lecture = {
        lectureDate: moment(lecture.start).format("YYYY/MM/DD"),
        lectureStartTime: moment(lecture.start).format("HH:mm"),
        lectureEndTime: moment(lecture.end).format("HH:mm"),
        ...lecture,
      };
      this.lectureDetailsModal.selectedLecture = lecture;
    },
  },
};
</script>

<style scoped>
.bg-curdate {
  background-color: #dff6ff !important;
  /* border: 0.5px solid #57A9CA;*/
  box-shadow: inset 0px 0px 0px 1px #57a9ca;
}
.bg-disabled-date {
  background-color: #f8f8f8;
}
.first-border {
  border: none !important;
}
.date-border {
  border-left: none !important;
}
.date-last-border {
  border-radius: 0 0 10px 0;
}
.date-first-border {
  border-radius: 0 0 0 10px;
}
.day-cell {
  height: 137px;
  padding: 10px;
  cursor: pointer;
  position: relative;
  background: #ffffff;
}
.lecture-modal-title {
  font-size: 16px;
  text-align: center;
  color: #34749b;
}
.lecture-modal-title.create {
  font-size: 16px;
  text-align:center;
  color: #34749b;
  margin-top:10px;
  padding-bottom:10px
}
.redbox {
  background: red;
  color: #fff;
}
.bluebox {
  background: blue;
  color: #fff;
}
::-webkit-scrollbar-thumb
{
  background: #DEDEDE !important;
}
.is-selected {
  background-color: purple !important;
}
.padding20{
  padding:20px;
}
.step3modal{
  top:10px;
  overflow-y: scroll !important;
}
.step3overflow{
  overflow-y: scroll !important;
  height: 550px
}

/deep/ .custom-calendar.vc-container {
  --day-border: 1px solid #b8c2cc;
  --day-border-highlight: 1px solid #b8c2cc;
  --day-width: 90px;
  --day-height: 11.5vh;
  --weekday-bg: #f8fafc;
  /* --weekday-border: 1px solid #eaeaea; */
}

.vc-pane{
  height: 80vh;
}

.calendar-side-block{
  height: 80vh;
  overflow: scroll;
}

.dashboard-wrapper{
  color: #858585;
  padding-top: 65px;
}

.cross{
    right: 1px;
    position: absolute;
    margin-left: 0;
    align-items: center;
    justify-content: center;
    display: flex;
    padding-left: 0;
    padding-right: 0;
}
.no-overflowx{
  overflow-x: hidden !important;
}
.sendbtn{
  border-radius:2px !important;
  height:30px !important;
  width:112px !important;
  outline:none !important;
  box-shadow: 0px 2px 4px rgba(136, 135, 135, 0.5) !important;
  font-size:12px !important;
  background: #34749B !important;
  color:white !important;
}

.student-list {
  overflow: auto;
  max-height: 420px;
}
.pulltobottom{
  position: absolute;
    right: 15px;
bottom:   15px;
}
.delete-small-btn{
  background: #de6356 !important
}
.cancel-small-btn{
  background: #B4B4B4 !important;
}
.dashbtn >>>.v-btn__content{
  font-size: 12px !important;
    color: #bfbfbf;
    display: flex;
    justify-content: flex-start;
}
.dashbtn >>>.theme--light.v-btn:not(.v-btn--flat):not(.v-btn--text):not(.v-btn--outlined) {
    background-color: transparent !important;
}
.dashbtn >>>.v-btn:not(.v-btn--round).v-size--default{
  height: 28px;
}
.f-18{
  font-size: 16px !important;
  padding-right: 6px;
}
</style>
