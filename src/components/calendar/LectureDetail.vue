<template>
  <!-- @click="goToWaitingRoom(lecture.id)" -->
<div class="lecture-card-block">
    <div class="w-full content-wrapper lecture-card" :class="lecture.class" @click="goToWaitingRoom(lecture.id)">
      <div class="tutorinfo" style="justify-content: space-between">
        <div class="tutor-name">{{ trimTutorName }}先生</div>
        <div class="time-stamp">
          <i class="fas fa-clock"></i>{{ timeString }}
        </div>
      </div>
      <div class="student-info">
        <i class="fas fa-user-alt"></i>
        {{ studentsString }}
      </div>
    </div>
    <div class="settings"
      v-if="lecture.class != ''"
      @click="openLectureDetails()"
    >
      <i class="fas fa-cog"></i>
    </div>
  </div>
</template>
<script>
import moment from "moment";
import { SET_LECTURE_ACTION } from '@/store/actionTypes';
import { mapState } from 'vuex';
export default {
  props: {
    lecture: Object,
    onEditLecture: Function,
  },
  computed: {
    dateString() {
      const { start } = this.lecture;
      return moment(start).format("YYYY/MM/DD");
    },
    timeString() {
      const { start, end } = this.lecture;

      const startTime = moment(start).format("HH:mm");
      const endTime = moment(end).format("HH:mm");

      return startTime + "-" + endTime;
    },
    studentsString() {
      const { students } = this.lecture;
      const contentWidth = window.innerWidth;
      let sstring= [];
      students.forEach(student => {
        sstring.push(student.familyName + ' ' + student.givenName);
      });
      return sstring.length < 3 ? sstring.join(", ") : sstring.slice(0, 2).join(", ") + ' 他' + (sstring.length - 2) + '名';
    },
    trimTutorName() {
      const contentWidth = window.innerWidth;
      let result = this.lecture.tutor.slice(0, parseInt(contentWidth / 70)) + (this.lecture.tutor.length > parseInt(contentWidth / 70) ? '...' : '');
      return result;
    }
  },
  methods: {
    goToWaitingRoom(lectureId) {
      this.$router.push({
        name: "management-waiting-room",
        params: { id: lectureId },
      });
    },
    openLectureDetails() {
      this.$store.dispatch(SET_LECTURE_ACTION, this.lecture);
      this.$modal.show('lecture-details-modal');
      this.$emit('onLectureEdit', this.lecture);
    }
  },
};
</script>

<style scoped>
.lecture-modal-title {
  font-size: 16px;
  margin-left: 208px;
  color: #34749b;
}
</style>
