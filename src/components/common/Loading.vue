<template>
    <div v-if="loading" class="loading-wrapper w-full h-screen">
        <img class="loading-img" src="@/assets/images/loading.gif" />
    </div>
</template>

<script>
export default {
  props: {
    loading: Boolean
  },    
}
</script>

<style scoped>
  .loading-wrapper{
    --bg-opacity: 0.65;
    background-color: rgba(255, 255, 255, var(--bg-opacity));

    position: absolute;
    left: 0px;
    top: 0px;
    z-index: 9999;
    display: flex;
    height: 100%;
    align-items: center;
    justify-content: center;    
  }
</style>