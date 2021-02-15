<template>
  <div class="w-full pa-7" style="marginTop:56px;fontSize:12px;">
    <div class="upload-btn pa-9" @click="openFileDlg()">
      <img src="@/assets/images/icon/upload.png" alt="">
      <div>
        <p>タップして、</p>
        <p style="margin-bottom: 0">アップロード</p>
      </div>
    </div>
    <v-file-input
      @change="uploadImage"
      accept="image/png, image/jpeg, image/gif"
      v-model="images"
      multiple
      ref="fileInput"
      v-show="false"
    ></v-file-input>
    <p style="margin-top: 26px;">アップロード済みの画像</p>
    <div class="uploaded-images-panel">
      <div
        v-for="(image, index) in uploaded.concat(uploadedImages)"
        :key="index"
        class="uploaded-image"
      >
        <v-img
          contain
          aspect-ratio="1.7"
          :src="imgSrc(image)"
          max-height="100%"
          max-width="100%"
        ></v-img>
        <img
          src="@/assets/images/icon/delete.png"
          class="delete-icon"
          @click="removeItem(image)"
        />
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import CommonService from '@/services/common';
import * as tutorService from '@/services/tutor';
import * as studentService from '@/services/student';

export default {
  name: 'MobileUploadMaterial',
  data () {
    return {
      baseAssetsUrl: process.env.VUE_APP_AWS_S3_BASE_URL,
      images: null,
      lectureURLId: null,
      lectureId: null,
      userId: '',
      uploadedImages: [],
      uploaded: []
    }
  },

  created () {
    this.lectureURLId = this.$route.params.lectureUrl
    this.userType = this.$route.path.split('/')[2];
    this.initialize(this.$route.path.split('/')[2])
  },

  methods: {
    async initialize (userType) {

      let result;
      switch (userType) {
        case 'student':
          result = await studentService.getStudentLecture(this.lectureURLId);
          break
        case 'teacher':
          result = await tutorService.getTutorLecture(this.lectureURLId);
          break
        default:
          break
      }

      if(result) {
        this.lectureId = result.data.lectureId;
        let tutor = result.data.lectureDetails.filter(item => item.userType === 0);
        let student = result.data.lectureDetails.filter(item => item.userType === 1);
        this.userId = result.data.lectureDetails[0].info.studentId;
        this.uploaded = result.data.lectureDetails[0].uploaded;
      }
    },

    imgSrc (item) {
      return `${this.baseAssetsUrl}/${process.env.VUE_APP_ENTERPRISE_ID}/lectures/${this.lectureId}/${this.userId}/${item}`
    },

    async removeItem (image) {
      // const uri = `/${this.userType}/deleteUploaded`
      this.uploaded = this.uploaded.filter(item => item !== image);
      const data = {
        lectureId: this.lectureId,
        userId: this.userId,
        fileName: image,
        uploaded: [
          ...this.uploaded
        ]
      }

      let result;

      switch (this.userType) {
        case 'student':
          result = await studentService.deleteUploaded(data);
          break
        case 'teacher':
          result = await tutorService.deleteUploaded(data);
          break
        default:
          break
      }

      // console.log(data);
      if(result) {
        this.uploaded = this.uploaded.filter(v => v !== image)
      }
    },

    async uploadImage () {

      const data = {
        enterpriseId: process.env.VUE_APP_ENTERPRISE_ID,
        lectureId: this.lectureId,
        studentId: this.userId,
        fileData: this.images.map(v => {
          return {
            contentType: `image/${v.name.split('.').pop().toLowerCase()}`,
            fileName: v.name
          }
        })
      }

      let result;

      switch (this.userType) {
        case 'student':
          result = await studentService.uploadImg(data)
          break
        case 'teacher':
          result = await tutorService.uploadImg(data)
          break
        default:
          break
      }

      if(result) {
        const promises = result.data.files.map((v, i) =>
          CommonService.axiosPutRequest(v.signedUrl, this.images[i]).then((result) => {})
        )

        Promise.all(promises).then(async () => {

          this.uploadedImages = result.data.files.map(v => `${v.fileName}`);

          let params = {
            studentId: this.userId,
            lectureId: this.lectureId,
            uploaded: this.uploaded.concat(this.uploadedImages)
          }

          switch (this.type) {
            case 'student':
              params = {
                studentId: this.userId,
                lectureId: this.lectureId,
                uploaded: this.uploaded.concat(this.uploadedImages)
              }
              break
            case 'teacher':
              params = {
                userId: this.userId,
                lectureId: this.lectureId,
                uploaded: this.uploaded.concat(this.uploadedImages)
              }
          }

          let response;

          switch (this.userType) {
            case 'student':
              response = await studentService.updateUploaded(params);
              break;
            case 'teacher':
              response = await tutorService.updateUploaded(params);
              break;
            default:
              break;
          }

          if(response) {
            this.uploaded = this.uploaded.concat(this.uploadedImages);
            this.uploadedImages = [];
          }
        });
      }
    },

    openFileDlg () {
      this.$refs.fileInput.$el.getElementsByClassName('v-text-field__slot')[0].click()
    }
  }
}
</script>

<style scoped>
  .upload-btn {
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    border: 1px dashed #979797;
    padding: 3px !important;
    margin-top: 10px;
  }

  .uploaded-images-panel {
    border: 0.5px solid #979797;
    box-sizing: border-box;
    padding: 16px 25px 16px 30px;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
  }
  .uploaded-image {
    position: relative;
    width: 42%;
    height: 107px;
    margin-bottom: 16px;
  }

  .delete-icon {
    position: absolute;
    top: 0px;
    right: 6px;
    z-index: 2;
  }
</style>
