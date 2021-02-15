<template>
  <v-stepper v-model="step" class="lecture-stepper">
    <v-stepper-header>
      <v-stepper-step
        :complete="step > 1"
        :step="1"
      >
        指導の作成
      </v-stepper-step>

      <v-divider></v-divider>

      <v-stepper-step
        :complete="step > 2"
        :step="2"
      >
        教材の指定
      </v-stepper-step>
    </v-stepper-header>
  </v-stepper>
</template>
<script>
export default {
  name: 'LectureStepper',
  props: { step: Number },
  data() {
    return {
      e1: 1,
    }
  }
}
</script>

<style scoped>
.step1-icon{
  padding: 5px 10px;
  align-items: center;
  background: #34749B;
  font-size:16px
}
.step2-icon{
  padding: 5px 10px;
  align-items: center;
  font-size:16px
}
.step2-text{
  margin-top:34px;
  font-size:8px;
  color: #979797;
}

.lecture-stepper {
  margin: auto;
  width: 350px;
}

.v-stepper {
  box-shadow: none;
}

.v-stepper__header {
  height: 50px !important;
}

.v-stepper__step {
  padding: 14px;
  font-size: 10px !important;
}
</style>
