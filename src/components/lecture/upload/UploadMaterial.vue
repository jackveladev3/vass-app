<template>
  <modal :name="name" :width="'900px'" :height="594" @before-close="beforeClose" class="modal-box">

    <p class="text-center" style="fontSize:16px;paddingTop:18px;color:#34749B;">
      <span v-if="userType === 'student'">教材/画像の挿入</span>
      <span v-if="userType === 'tutor' || userType === 'admin'">教材/資料一覧</span>
    </p>

    <div class="tab-header flex" style="marginTop:25px;marginLeft:20px">
      <p
        class="text-black text-center"
        style="width:140px;cursor:pointer;fontSize:14px"
        :style="tab === 0 ? 'border-bottom:4px solid #34749B' : ''"
        @click="tab = 0"
      >
        <span v-if="userType === 'student'">指定教材</span>
        <span v-if="userType === 'tutor' || userType === 'admin'">教材追加</span>
        </p>
      <p
        class="text-black text-center"
        style="width:140px;cursor:pointer;fontSize:14px"
        :style="tab === 1 ? 'border-bottom:4px solid #34749B' : ''"
        @click="tab = 1"
      >
        <span v-if="userType === 'student'">アップロードファイル</span>
        <span v-if="userType === 'tutor' || userType === 'admin'">アップロード</span>
      </p>
    </div>
    <div class="tabs-panel">
      <div class="upload-panel" v-if="tab === 0">
        <AddMaterial
          :userType="userType"
          ref="addMaterialRef"
          :lectureId="lectureId"
          :studentId="studentId"
          v-if="lecture.id !== ''"
        />
      </div>

      <div class="upload-panel" v-if="tab === 1">
        <div class="preview-panel">
          <div>
            <v-file-input
              @change="uploadImages"
              accept="image/png, image/jpeg, image/gif"
              v-model="images"
              ref="fileInput"
              multiple
              v-show="false"
            ></v-file-input>
            <v-btn class="btn btn-open" @click="openFileDlg()">ファイルを選択</v-btn>
          </div>
          <div style="clear: right;"></div>
          <div class="flex preview-images">
            <div
              class="preview-image-card"
              v-for="(item, index) in allUploadedImages[studentId]"
              :key="index"
            >
              <v-img
                :src="imgSrc(item)"
                class="preview-image-content"
                @click="openPreviewModal(index)"
              ></v-img>
              <img
                src="@/assets/images/icon/delete.png"
                class="delete-icon"
                @click="removeImage(item)"
              />
            </div>

          </div>
        </div>

        <div class="qr-panel" v-if="this.$route.name !== 'home'">
          <p style="font-size: 12px;">スマホからのアップロードはこちらから</p>
          <VueQrcode
            :value="url"
            :options="{ width: 106 }"
          />
        </div>
      </div>
    </div>

    <div class="tab-btns" v-if="tab === 0 && (userType === 'tutor' || userType === 'admin')">
      <v-btn class="btn btn-cancel" @click="handleCancelMaterials()">キャンセル</v-btn>
      <v-btn class="btn btn-save" @click="handleConfirmMaterials()">選択</v-btn>
    </div>

    <div class="tab-btns" v-if="tab === 1">
      <v-btn class="btn btn-cancel" @click="onCancel()">キャンセル</v-btn>
      <v-btn class="btn btn-save" @click="onSave()">選択</v-btn>
    </div>

    <MaterialGallery
      :name="'preview-material-modal'"
      :galleryItems="galleryItems()"
      ref="materialRef"
    />

  </modal>
</template>

<script>
import MaterialGallery from './MaterialGallery'
import VueQrcode from '@chenfengyuan/vue-qrcode'
import AddMaterial from '@/components/lecture/material/AddMaterial'
import axios from 'axios'
import { SET_LECTURE_ACTION } from '@/store/actionTypes';
import { mapState } from 'vuex';
import LectureService from '@/services/common';
import * as adminService from '@/services/admin';
import * as tutorService from '@/services/tutor';
import * as studentService from '@/services/student';

export default {
  name: 'UploadMaterial',
  components: {
    MaterialGallery,
    VueQrcode,
    AddMaterial
  },
  props: {
    name: String,
    url: String,
    lectureId: String,
    studentId: String,
    uploaded: Array,
    setUploadedMaterials: Function,
    lecture: Object,
    userType: String,
  },
  data () {
    return {
      baseAssetsUrl: process.env.VUE_APP_AWS_S3_BASE_URL,
      enterPriseId: process.env.VUE_APP_ENTERPRISE_ID,
      images: [],
      uploadedImages: [],
      tab: 0,
      curMatIndex: 0,
      uploadedImagesTemp: [],
      allUploadedImages: [],
      tempImage: {},
      uploadedState: [],
      defaultTab: 0
    }
  },
  created () {
    this.uploadedState = [
      ...this.uploaded
    ]
    this.tab = this.defaultTab
    // this.initialize();
    let uploadedOld = this.uploaded.map(item => {
        return {
          type: 'path',
          image: item
        }
      })
    this.allUploadedImages[this.studentId] = [
      ...uploadedOld
    ];

    this.uploadedImagesTemp[this.studentId] = []

    this.uploadedImagesTemp[this.studentId] = []

    var temp = this.allUploadedImages[this.studentId].map(item => {
        return item.type == 'path'
    })
  },
  watch: {
    'uploaded' (uploaded) {
      let uploadedOld = this.uploaded.map(item => {
        return {
          type: 'path',
          image: item
        }
      })
      this.allUploadedImages[this.studentId] = [
        ...uploadedOld
      ];
      this.methodThatForcesUpdate();
    },
    'tempImage' (tempImage) {
      let uploadedNew = {
          type: 'blob',
          image: tempImage.blob
      }
      this.allUploadedImages[this.studentId] = [
        ...this.allUploadedImages[this.studentId],
        uploadedNew
      ];
    }
  },
  methods: {
    methodThatForcesUpdate() {
      this.$forceUpdate();
    },
    beforeClose () {
      //this.allUploadedImages = []
    },
    galleryItems () {
      if (typeof this.allUploadedImages[this.studentId] == "undefined" ) {
        this.allUploadedImages[this.studentId] = []
      }

      return this.allUploadedImages[this.studentId].map(item => {
        return item.type == 'path' ? `${this.baseAssetsUrl}/${this.enterPriseId}/lectures/${this.lectureId}/${this.studentId}/${item.image}` : item.image
      })
    },
    openPreviewModal (id) {
      this.curMatIndex = id
      this.$modal.show('preview-material-modal')
      this.$refs.materialRef.setInitialIndex(id)
    },
    async removeImage(item) {
      if(item.type === 'path') {
        let uploadedImages = this.uploaded.filter(e => e !== item.image)
        let data = {
            userId: this.studentId,
            lectureId: this.lectureId,
            fileName: item.image,
            uploaded: [
              ...uploadedImages
            ]
        }
        let result;

        if(this.userType === 'admin') {
          result = await adminService.deleteUploaded(data);
        } else if(this.userType === 'tutor') {
          result = await tutorService.deleteUploaded(data);
        } else if(this.userType === 'student') {
          result = await studentService.deleteUploaded(data);
        }

        if(result) {
          this.uploaded = result.data.uploaded;
        }
      } else if(item.type === 'blob') {
        const temp1 = this.allUploadedImages[this.studentId];
        const filteredTemp1 = temp1.filter(e => e.image !== item.image);
        this.allUploadedImages[this.studentId] = Object.assign([], filteredTemp1);
        const filteredTemp2 = this.uploadedImagesTemp[this.studentId].filter(e => e.blob !== item.image);
        this.uploadedImagesTemp[this.studentId] = Object.assign([], filteredTemp2);
      }
      this.$forceUpdate();
    },
    imgSrc (item) {
      return item.type === 'path' ? `${this.baseAssetsUrl}/${process.env.VUE_APP_ENTERPRISE_ID}/lectures/${this.lectureId}/${this.studentId}/${item.image}` : item.image
    },
    openFileDlg () {
      this.$refs.fileInput.$el.getElementsByClassName('v-text-field__slot')[0].click()
    },
    uploadImages () {
      if(!this.uploadedImagesTemp[this.studentId]){
        this.uploadedImagesTemp[this.studentId] = []
      }
      this.tempImage = {
        file: this.images[0],
        blob: URL.createObjectURL(this.images[0])
      }
      this.uploadedImagesTemp[this.studentId].push(this.tempImage);
    },
    async uploadImagesToServer(){
      const data = {
        enterpriseId: process.env.VUE_APP_ENTERPRISE_ID,
        lectureId: this.lectureId,
        studentId: this.studentId,
        fileData: this.uploadedImagesTemp[this.studentId].map(element => {
          return {
            contentType: `image/${element.file.name.split('.').pop().toLowerCase()}`,
            fileName: element.file.name
          }
        })
      }
      let result;

      if(this.userType === 'admin') {
        result = await adminService.uploadImg(data);
      } else if(this.userType === 'tutor') {
        result = await tutorService.uploadImg(data);
      } else if(this.userType === 'student') {
        result = await studentService.uploadImg(data);
      }

      if(result) {

        let imagesUrls = this.uploaded.concat(result.data.files.map(item => `${item.fileName}`))

        const params = {
          enterpriseId: process.env.VUE_APP_ENTERPRISE_ID,
          studentId: this.studentId,
          lectureId: this.lectureId,
          uploaded: imagesUrls
        }

        let response;

        setTimeout(async () => {
          if(this.userType === 'admin') {
            response = await adminService.updateUploaded(params);
          } else if(this.userType === 'tutor') {
            response = await tutorService.updateUploaded(params);
          } else if(this.userType === 'student') {
            response = await studentService.updateUploaded(params);
          }

          if(response) {
            if(this.userType === 'student') {
              this.setUploadedMaterials(imagesUrls);
            }
            this.$modal.hide(this.name);
          }

          result.data.files.forEach((v, i) => {
            LectureService.axiosPutRequest(v.signedUrl, this.uploadedImagesTemp[this.studentId][i].file)
            .then(() => {
              this.uploadedImagesTemp[this.studentId] = [];
            });
          });
        }, 2000);
      }
    },
    onSave () {
      if(!this.lectureId){
        let tempLecture = {
          ...this.lecture
        }
        for (const student of tempLecture.students) {
        if (student.id === this.studentId) {
          student.uploaded = {
            imagesUrls: this.uploaded,
            filesToUpload: this.uploadedImagesTemp[this.studentId]
          }
          break
        }
      }
        this.$store.dispatch(SET_LECTURE_ACTION, tempLecture)
        this.$modal.hide(this.name)
      } else {
        this.uploadImagesToServer()
      }
    },
    onCancel () {
      this.uploadedImagesTemp[this.studentId] = []
      this.$modal.hide(this.name)
    },
    handleConfirmMaterials () {
      const workbooks = this.$refs.addMaterialRef.handleConfirmMaterials()
      this.$modal.hide('select-material-modal')
    },
    handleCancelMaterials () {
      this.$modal.hide('select-material-modal')
    }
  }
}
</script>

<style scoped>
  .tab-header p {
    margin-bottom: 0;
  }

  .tabs-panel {
    border: 0.5px solid #979797;
    box-sizing: border-box;
    margin: 0 20px;
    min-height: 444.34px;
  }

  .preview-images {
    padding: 15px 24px 17px 24px;
    max-height: 272px;
    height: 272px;
    overflow: auto;
    flex-wrap: wrap;
  }

  .preview-image-content {
    width: 150px;
    height: 150px;
    margin-bottom: 10px;
    object-fit: cover;
  }

  .preview-image-card {
    position: relative;
    display: flex;
    margin: auto 30px auto 0px;
  }

  .preview-image-card i {
    position: absolute;
    top: 15px;
    right: 5px;
    cursor: pointer;
  }

  .delete-icon {
    position: absolute;
    top: 0px;
    right: 6px;
    cursor: pointer;
    z-index: 2;
  }

  @media only screen and (max-height: 650px) {
    .preview-images {
      height: 200px;
    }
  }

  .preview-images img {
    max-width: 120px;
    margin-top: 12px;
    object-fit: contain;
  }

  .preview-image {
    margin: 0 16px;
    width: 15%;
  }

  @media only screen and (max-width: 576px) {
    .preview-image {
      margin: 0 8px;
      width: 20%
    }
  }

  .qr-panel {
    background: #F5F5F5;
    width: 90%;
    height: 120px;
    margin: 15px auto;
    padding: 0 10px;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
  }

  .qr-panel p {
    margin-bottom: 0;
  }

  .tab-btns {
    position: relative;
  }

  .btn {
    font-size: 12px !important;
    line-height: 14px !important;
    color: #FFFFFF !important;
    height: 22px !important;
  }

  .btn-open {
    background: #57A8C9 !important;
    margin-top: 13px;
    margin-right: 12px;
    float: right;
  }

  .btn-save {
    position: absolute;
    top: 14px;
    right: 20px;
    background: #34749B !important;
  }

  .btn-cancel {
    position: absolute;
    top: 14px;
    right: 104px;
    background: #C6C6C6 !important;
  }

  .preview-panel >>> .btn{
    width: 129px !important;
  }

  .preview-panel >>> .v-btn__content{
    margin-top: 2px;
  }

</style>
