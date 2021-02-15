<template>
  <div class="w-full" style="marginBottom:30px">

    <div
      class="w-full flex items-center bg-custom text-white"
      style="padding:4px;paddingLeft:13px;border-radius:2px;height: 24px "
    >
      <i class="fas fa-user" />
      <p style="fontSize:12px;marginLeft:12px" class="custom-p">{{ student }}</p>
    </div>
    <div
      v-if="workbooks.length === 0"
      class="flex items-center"
      style="padding:9px;paddingLeft:13px;border-radius:2px;box-shadow:0px 2px 4px #BEBEBE80"
    >
      <i class="fas fa-cog fa-2x text-dark" style="cursor:pointer" @click="onSelectMaterials" />
      <p style="fontSize:12px;marginLeft:16px" class="custom-p">クリックして設定</p>
    </div>
    <div
      v-else
      class="flex items-center"
      style="padding:13px;paddingBottom:9px;border-radius:2px;box-shadow:0px 2px 4px #BEBEBE80"
    >
      <i v-if="isEdit" class="fas fa-cog fa-2x text-dark" style="cursor:pointer;marginRight:16px" @click="onSelectMaterials" />
      <div>
        <p
          class="p-workbook"
          @click="onSelectMaterials"
          v-for="(workbook, index) in workbooks"
          :key="'workbook_' + index"
        >{{ workbook.workbookJapaneseName }}ワークブック No.{{pagesString(workbook.pageId)}}</p>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'StudentWorkbooks',
  props: {
    student: String,
    onSelectMaterials: Function,
    workbooks: Array,
    isEdit: Boolean
  },
  methods: {
    pagesString (pageId) {
      return pageId
        .map((page) =>
          parseInt(page.no)
        )
        .join(', ')
    }
  }
}
</script>

<style scoped>
.p-workbook{
  font-size:8px;
  margin-bottom:5px;
  cursor: pointer;
}
.bg-custom{
  background: #57A9CA;
  --text-opacity: 1;
}
.custom-p{
  margin-top:8px !important;
  margin-bottom: 8px !important;
  font-size: 12px;
}
</style>
