<template>
  <div class="daycell-inner">
    <div
      class="lecture-infochip"
      v-for="(lecture, index) in lectures"
      :key="index"
    >
      {{starTime(lecture.start)}} {{ familyName(lecture.tutor) }}先生
    </div>
    <div
      class="daycell-date"
    >{{ date }}</div>
    <p
      class="lectureinfo"
      v-if="more > 0"
    >+{{ more }}件の授業があります</p>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  props: {
    date: Number,
    lectures: Array,
    weekDays: Array,
    more: Number
  },
  methods: {
    familyName (fullName) {
      return fullName.split(' ')[0]
    },
    starTime (time) {
      return moment(time).format('HH:mm')
    }
  }
}
</script>
