<template>
  <div w-full>
    <div
      class="w-full flex items-center bg-primary text-white"
       style="padding:4px;paddingLeft:13px;border-radius:2px;margin-bottom: 0 !important;background: #57A9CA;"
    >
      <i :class="type === 'teacher' ? 'fas fa-chalkboard-teacher' : 'fas fa-user'" />
      <p style="fontSize:12px;marginLeft:12px;margin-bottom: 0 !important;">{{ name }} {{ type === "teacher" ? "先生" : "さん" }}</p>
      <div class="flex flex-grow justify-end">
        <p
          class="bg-white text-center"
          :class="emailStatus ? 'text-primary' : 'text-highlight'"
          style="width:50px;height:14px;fontSize:8px;border-radius:2px;margin-bottom: 0 !important;color: #57A9CA;"
        >{{ emailStatus ? "送付完了" : "未送付" }}</p>
      </div>
    </div>
    <div
      class="bg-white"
      style="padding:13px;paddingTop:9px;paddingBottom:5px;border-radius:2px;box-shadow:0px 2px 4px #BEBEBE80"
    >
      <div class="flex items-center padding-btm">
        <i class="fas fa-paperclip fa-xs pointermouse" @click="handleCopyLink" />
        <p style="fontSize:8px;marginLeft:3px;margin-bottom: 0 !important">こちらのURLから入室できます</p>
      </div>
      <div @click="handleCopyLink" class="flex items-center;marginTop:3px">
        <p class="pointermouse" style="fontSize:8px;marginRight:38px">{{ URL }}</p>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'LectureURLBox',
  props: {
    type: String,
    name: String,
    URL: String,
    emailStatus: Boolean
  },
  methods: {
    handleCopyLink () {
      navigator.clipboard.writeText(this.URL)
    }
  }
}
</script>

<style scoped>
.padding-btm{
  padding-bottom: 5px;
}
.pointermouse{
  cursor:pointer;
}
</style>
