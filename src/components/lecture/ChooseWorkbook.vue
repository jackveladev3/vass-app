<template>
  <div class="flex flex-col justify-between height450">

    <div style="paddingTop:20px;paddingLeft:50px;paddingRight:50px">
      <StudentWorkbooks
        v-for="(student, index) in lecture.students"
        :key="'workbooks_' + index"
        :student="student.familyName + ' ' + student.givenName"
        :onSelectMaterials="() => {handleSelectMaterials(student.id)}"
        :workbooks="student.workbooks"
        :isEdit="isEdit"
      />
    </div>
    <div class="flex justify-end pulltobottom" style="marginBottom:17px;marginRight:14px">
      <v-btn class="text-white bg-dark prevbtn" @click="onPrev">戻る</v-btn>
      <v-btn class="text-white bg-button sendbtn" @click="onSendLink">リンクを送付</v-btn>
    </div>

    <UploadMaterial
      :name="'select-material-modal'"
      :url="url"
      :lectureId="lectureId"
      :studentId="curStudentId"
      :uploaded="studentMaterials"
      :lecture="lecture"
      :userType="'admin'"
    />

  </div>
</template>
<script>
import StudentWorkbooks from './StudentWorkbooks'
import UploadMaterial from '@/components/lecture/upload/UploadMaterial'
import { SET_LECTURE_ACTION } from '@/store/actionTypes';
import { mapState } from 'vuex';

export default {
  name: 'ChooseWorkbook',
  props: {
    onPrev: Function,
    onSendLink: Function,
    isEdit: Boolean
  },
  components: {
    StudentWorkbooks,
    UploadMaterial
  },
  data () {
    return {
      tab: 0,
      curStudentId: '',
      url: '',
      lectureId: '',
      studentMaterials: [],
    }
  },
  mounted () {
    let tempObj = JSON.parse(JSON.stringify(this.lecture));
    tempObj.id = 0
    this.$store.dispatch(SET_LECTURE_ACTION, tempObj);
  },
  computed: {
     ...mapState({
      lecture: state => state.lecture.lecture
    })
  },
  methods: {
    handleSelectMaterials (id) {
      this.curStudentId = id;
      this.$modal.show('select-material-modal');
    },
    handleConfirmMaterials (workbooks) {
      /*let tempObj = {
        ...this.lecture,
        students: []
      };*/
      let tempObj = JSON.parse(JSON.stringify(this.lecture));
      for (let student of this.lecture.students) {

        if (student.id === this.studentId) {

          let obj1 = {
            ...student,
            workbooks: []
          }
          for (const workbook of workbooks) {

            obj1.workbooks.push({
              id: workbook.id,
              workbookJapaneseName: workbook.workbookJapaneseName,
              pageId: [...workbook.pageId]
            });

          }
          tempObj.students.push(obj1);
          break;
        }
      }

      this.$store.dispatch(SET_LECTURE_ACTION, tempObj);
      this.$modal.hide('select-material-modal');
    },
    handleCancelMaterials () {
      this.$modal.hide('select-material-modal');
    }
  }
}
</script>
<style scoped>
.height450{
  height: 450px;
}
.prevbtn{
  border-radius:2px !important;
  height:30px !important;
  width:98px !important;
  outline:none !important;
  box-shadow: 0px 2px 4px rgba(136, 135, 135, 0.5) !important;
  margin-right:24px !important;
  font-size:12px !important;
  background: #C5C5C5 !important;
  color:white !important;
  margin-bottom: 6px !important;
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
.pulltobottom{
  position: absolute;
right:    0;
bottom:   15px;
}
</style>
