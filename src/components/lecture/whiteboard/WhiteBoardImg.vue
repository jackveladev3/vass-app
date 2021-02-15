<template>
  <modal :name="name" :width="900" :height="654">
    <div class="d-flex justify-content-between">
      <div class="whiteboard-username">
        {{username}} さんの共有ボード
      </div>
    </div>
    <div id="print" class="gallery-content">
      <div class="print-wrapper">
        <img :src="galleryItems[curIndex]" alt="" />
      </div>
    </div>
    <div class="gallery-bar" v-if="galleryItems.length !== 0">
      <v-sheet
        class="mx-auto"
      >
        <v-slide-group
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
  name: 'WhiteBoardImg',
  props: {
    whiteBoardMaterials: Array,
    name: String,
    username: String
  },
  data () {
    return {
      galleryItems: [],
      activeElement: 0,
      thumbnailIndex: 0,
      curIndex: 0,
    }
  },
  watch: {
    'whiteBoardMaterials'(whiteBoardMaterials) {
      this.galleryItems = [
        ...whiteBoardMaterials
      ]
    }
  },
  methods: {
    setInitialIndex(index){
      this.activeElement = index;
      this.thumbnailIndex = index;
      this.curIndex = index;
    },
    nextImg () {
      this.thumbnailIndex++
      this.thumbnailIndex = this.thumbnailIndex % this.galleryItems.length
    },
    selectImg (index) {
      this.curIndex = index % this.galleryItems.length
      this.thumbnailIndex = index % this.galleryItems.length
      this.activeElement = index;
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
    background-color: transparent;
  }

  .gallery-content img {
    margin: 0 auto;
    height: 560px;
  }

  .gallery-bar {
    position: absolute;
    width: 100%;
    height: 66px;
    left: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.6);
  }

  .gallery-bar .v-sheet {
    background-color: transparent;
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

  .whiteboard-username {
    padding: 3px;
    background-color: rgba(0, 0, 0, 0.5);
    color: white;
  }
</style>
