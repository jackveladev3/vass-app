<template>
  <modal :name="name" :width="900" :height="654">

    <button @click="print()"><img src="@/assets/images/icon/printer.png" alt="Print" class="btn-modal-print"></button>
    <div id="print" class="gallery-content">
      <div class="print-wrapper">
        <img :src="galleryItems[curIndex]" alt="" />
      </div>
    </div>
    <div class="gallery-bar">
      <v-sheet
        class="mx-auto"
      >
        <v-slide-group
          multiple
          center-active
          show-arrows
        >
          <v-slide-item
            v-for="(galleryItem, index) in galleryItems"
            :key="index"
            v-slot:default="{ active, toggle }"
          >
            <v-img
              :src="galleryItem"
              alt="lecture"
              class="gallery-item-img"
              @click="selectImg(index)"
              :class="{ active : activeElement == index }"
            ></v-img>
          </v-slide-item>
        </v-slide-group>
      </v-sheet>
    </div>
  </modal>
</template>

<script>
import { mapState } from 'vuex';
export default {
  name: 'MaterialGallery',
  props: {
    galleryItems: Array,
    name: String,
  },
  data () {
    return {
      activeElement: 0,
      thumbnailIndex: 0,
      baseAssetsUrl: process.env.VUE_APP_AWS_S3_BASE_URL,
      curIndex: 0,
    }
  },
  computed: {
    ...mapState({
      auth: state => state.auth.user,
      lecture: state => state.lecture.lecture
    })
  },
  methods: {
    setInitialIndex(index){
      this.activeElement = index
      this.thumbnailIndex = index
      this.curIndex = index
    },
    nextImg () {
      this.thumbnailIndex++
      this.thumbnailIndex = this.thumbnailIndex % this.galleryItems.length
    },
    selectImg (index) {
      this.curIndex = index % this.galleryItems.length
      this.thumbnailIndex = index % this.galleryItems.length
      this.activeElement = index;
    },
    print () {
      var prtContent = document.getElementById('print')
      var WinPrint = window.open('', '', 'left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0')

      WinPrint.document.write(`<!DOCTYPE html>
      <html>
        <head>
          <style type="text/css">
            img { margin: auto; width: 100%; }
          </style>
        </head>
        <body>
        <div style="display:flex; justify-content: center;>
          ${prtContent.innerHTML}
        </div>
        </body>
      </html>`);

      WinPrint.document.close()
      WinPrint.focus()
      WinPrint.print()
      // WinPrint.close()
    }
  },
}
</script>
<style scoped>
  .btn-modal-print {
    position: absolute;
    top: 15px;
    right: 15px;
    width: 30px;
  }

  .gallery-content {
    margin: 48px 133px 0 133px;
  }

  .gallery-content img {
    height: 440px;
    margin: 0 auto;
  }

  .gallery-bar {
    position: absolute;
    width: 100%;
    height: 66px;
    left: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.6);
  }

  .gallery-item {
    height: 480px;
  }

  .gallery-item-img {
    margin: 8px 8px;
    height: 50px;
    max-width: 100px;
    object-fit: cover;
  }

  .gallery-bar >>> .v-slide-group__next, .gallery-bar >>> .v-slide-group__prev{
    background-color: rgba(0, 0, 0, 0.5);
    margin-top: 8px;
    margin-bottom: 8px;
  }

  .active{
    border: 2px solid red;
  }
</style>
