<template>
  <div class="w-full">
    <div style="height:443px;width:860">

      <div v-if="userType === 'tutor' || userType === 'admin'" class="w-full flex flex-wrap" style="padding:14px;paddingBottom:0px">
        <button
          class="border border-material"
          style="height:20px;width:176px;outline:none;marginRight:20px;fontSize:12px"
          @click="curWorkbook = 0"
          :class="curWorkbook === 0 ? 'bg-material text-white' : 'text-material'"
        >選択中
          <v-chip
            :class="
             curWorkbook === 0
             ? 'selected-counter-chip'
             : 'counter-chip'
            "
          >{{selectedMaterials.length}}</v-chip>
        </button>
        <button
          v-for="(workbook, index) in workbooks"
          :key="'workbooktitle_' + index"
          class="border border-material"
          style="height:20px;width:176px;outline:none;marginRight:20px;fontSize:12px"
          @click="curWorkbook = index + 1"
          :class="
            curWorkbook === index + 1
              ? 'bg-material text-white'
              : 'text-material'
          "
        >{{ workbook.workbookJapaneseName }} ワークブック
          <v-chip
            :class="
             curWorkbook === index + 1
             ? 'selected-counter-chip'
             : 'counter-chip'
            "
          >{{workbook.materials.length}}</v-chip>
        </button>
      </div>
      <div
        v-if="curWorkbook === 0"
        class="w-full flex flex-wrap"
        style="padding:24px;paddingTop:0px"
      >
        <div
          class="border border-material"
          style="marginTop:30px;width:180px;height:132px;position:relative;border-color:inherit;"
          :style="index % 4 !== 0 ? 'marginLeft:30px' : ''"
          v-for="(material, index) in selectedMaterials"
          :key="'sel_material_' + index"
        >
          <v-img
            :src="`${imageUrl}/${material.path}`"
            class="workbook-material-icon"
            @click="openSelectedPreview(index)"
          ></v-img>

          <i
            v-if="userType === 'tutor' || userType === 'admin'"
            class="far fa-times-circle text-material"
            style="position:absolute;left:159px;top:3px;cursor:pointer"
            @click="material.checked = false"
          />

          <div style="position: absolute; bottom: 0; width: 100%; color: white; background: rgba(0, 0, 0, 0.6); padding-left: 5px;">P.{{material.pageIndex}}</div>

        </div>
      </div>
      <div v-if="curWorkbook > 0 && (userType === 'tutor' || userType === 'admin')" class="w-full flex flex-wrap" style="padding:24px;paddingTop:0px">
        <div
          class="border border-material"
          style="marginTop:30px;width:180px;height:132px;position:relative;border-color:inherit;"
          :style="index % 4 !== 0 ? 'marginLeft:30px' : ''"
          v-for="(material, index) in workbooks[curWorkbook - 1].materials"
          :key="'material_' + index"
        >
          <v-img
            :src="`${imageUrl}/${material.path}`"
            class="workbook-material-icon"
            @click="openMaterialPreview(index)"
          ></v-img>
          <v-checkbox
            :id="'check_' + material.path"
            v-model="material.checked"
            style="position: absolute; left: 150px; top: 0px; margin-top: 0px;"
          ></v-checkbox>
          <div style="position: absolute; bottom: 0; width: 100%; color: white; background: rgba(0, 0, 0, 0.6); padding-left: 5px;">P.{{material.pageIndex}}</div>
        </div>
      </div>
    </div>
    <MaterialGallery
      :name="'workbooks-gallery-modal'"
      :galleryItems="previewWorkBooks.map(item => { return `${imageUrl}/${item.path}`})"
      :lectureId="lectureId"
      ref="workbookMaterialRef"
    />
  </div>
</template>
<script>
import MaterialGallery from '@/components/lecture/upload/MaterialGallery';
import * as adminService from '@/services/admin';
import { SET_LECTURE_ACTION } from '@/store/actionTypes';
import { mapState } from 'vuex';

export default {
  name: 'AddMaterial',
  props: {
    lectureId: String,
    studentId: String,
    userType: String
  },
  components: {
    MaterialGallery
  },
  data () {
    return {
      curWorkbook: 0,
      workbooks: [],
      previewWorkBooks: [],
      curMatIndex: 0,
    }
  },
  computed: {
    ...mapState({
      lecture: state => state.lecture.lecture
    }),
    selectedMaterials () {
      const materials = [];
      for (const workbook of this.workbooks) {
        for (const material of workbook.materials) {
          if (material.checked) {
            materials.push(material);
          }
        }
      }
      return materials;
    },
    imageUrl () {
      return process.env.VUE_APP_AWS_S3_BASE_URL;
    },
    selectedWorkbooksData () {
      const data = [];
      for (const workbook of this.workbooks) {
        const workbookData = {
          id: workbook.id,
          workbookJapaneseName: workbook.workbookJapaneseName,
          pageId: [],
        }

        for (const material of workbook.materials) {
          if (material.checked) {
            if(this.$router.history.current.name === 'home') {
              workbookData.pageId.push({
                path: material.path,
                no: material.pageIndex
              })
            } else {
              workbookData.pageId.push(material.path)
            }
          }
        }
        if (workbookData.pageId.length > 0) {
          data.push(workbookData)
        }
      }
      return data;
    }
  },
  mounted () {
    this.loadWorkbooks();
  },
  methods: {
    async loadWorkbooks () {
      let studentWorkbooks = [];
      for (const student of this.lecture.students) {
        if (student.id === this.studentId) {
          studentWorkbooks = student.workbooks
          break;
        }
      }

      adminService.listWorkbooks()
        .then((result) => {

          for (const workbookdata of result.data) {

            const workbook = {
              id: workbookdata.workbookId,
              workbookName: workbookdata.workbookName,
              workbookJapaneseName: workbookdata.workbookJapaneseName,
              materials: workbookdata.pageId.map((item, index) => ({
                path: item.pagePath,
                pageIndex: item.pageNo,
                checked: false,
              }))
            }

            //  check selected materials
            for (const studentWorkbook of studentWorkbooks) {
              if (workbook.id === studentWorkbook.id) {
                for (const material of workbook.materials) {
                  for (const page of studentWorkbook.pageId) {
                    if(this.$router.history.current.name === 'home') {
                      if (material.path == page.path) {
                        material.checked = true;
                        break;
                      }
                    } else {
                      if (material.path == page) {
                        material.checked = true;
                        break;
                      }
                    }
                  }
                }
                break;
              }
            }
            this.workbooks.push(workbook);
          }
        });
    },
    handleConfirmMaterials () {

      let workbooks = this.selectedWorkbooksData;

      let tempObj = {
        ...this.lecture,
        students: []
      };

      for (let student of this.lecture.students) {
        let obj1 = {};
        if (student.id === this.studentId) {
          obj1 = {
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
        } else if (student.id !== this.studentId) {
          obj1 = {
            ...student
          }
        }
        tempObj.students.push(obj1);
      }

      this.$store.dispatch(SET_LECTURE_ACTION, tempObj);
      if(this.userType !== 'student' && this.$router.history.current.name !== 'home')
      this.updateWorkbooks();
    },

    async updateWorkbooks () {
      const student = this.lecture.students.filter(item => item.id === this.studentId);
      let workbooks = [];
      if(this.$router.history.current.name === 'home') {
        workbooks = student[0].workbooks.map((workbook) => ({
          id: workbook.id,
          pageId: workbook.pageId.map(item => (
            item.path.split("/").pop()
          ))
        }))
      } else {
        workbooks = student[0].workbooks.map((workbook) => ({
          id: workbook.id,
          pageId: workbook.pageId.map(item => (
            item.split("/").pop()
          ))
        }))
      }

      const data = {
        enterpriseId: process.env.VUE_APP_ENTERPRISE_ID,
        lectureId: this.lecture.id,
        userId: this.studentId,
        workbooks: workbooks
      }

      let result = await adminService.reassignMaterial(data);

    },
    async openSelectedPreview (id) {
      this.previewWorkBooks = this.selectedMaterials;
      this.curMatIndex = id
      this.$modal.show('workbooks-gallery-modal')
      this.$refs.workbookMaterialRef.setInitialIndex(id)
    },

    openMaterialPreview (id) {
      this.previewWorkBooks = this.workbooks[this.curWorkbook - 1].materials;
      this.curMatIndex = id
      this.$modal.show('workbooks-gallery-modal')
      this.$refs.workbookMaterialRef.setInitialIndex(id)
    }
  }
}
</script>
<style>
/* Base for label styling */
[type="checkbox"]:not(:checked),
[type="checkbox"]:checked {
  position: absolute;
  left: -9999px;
}
[type="checkbox"]:not(:checked) + label,
[type="checkbox"]:checked + label {
  position: relative;
  padding-left: 1.5em;
  cursor: pointer;
}

/* checkbox aspect */
[type="checkbox"]:not(:checked) + label:before,
[type="checkbox"]:checked + label:before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  width: 1.25em;
  height: 1.25em;
  border: 2px solid #34749B;
  background: #fff;
  border-radius: 4px;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
}
/* checked mark aspect */
[type="checkbox"]:not(:checked) + label:after,
[type="checkbox"]:checked + label:after {
  content: "\2713\0020";
  position: absolute;
  top: 0.15em;
  left: 0.22em;
  font-size: 1.3em;
  line-height: 0.8;
  color: #34749B;
  transition: all 0.2s;
}
/* checked mark aspect changes */
[type="checkbox"]:not(:checked) + label:after {
  opacity: 0;
  transform: scale(0);
}
[type="checkbox"]:checked + label:after {
  opacity: 1;
  transform: scale(1);
}

.bg-material {
  background-color: #34749B !important;
  border-radius: 4px;
}

.text-material {
  color: #34749B !important;
  border-color: #34749B !important;
  border-radius: 4px;
  border-style: solid;
}

.selected-counter-chip {
  font-size: 10px !important;
  height: 15px !important;
  margin: auto !important;
  color: #34749B !important;
  background: white !important;
}

.counter-chip {
  font-size: 10px !important;
  height: 15px !important;
  margin: auto !important;
  color: white !important;
  background:  #34749B !important;
}

.workbook-material-icon {
  width: 200px;
  height: 130px;
  object-fit: cover;
}


</style>
