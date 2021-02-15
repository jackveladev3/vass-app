import {
  CLEAR_LECTURE_ACTION,
  SET_LECTURE_ACTION
} from './actionTypes';

import {
  SET_LECTURE,
  CLEAR_LECTURE
} from './mutationTypes';

const state = {
  lecture: {
    id: '',
    startTime: '',
    endTime: '',
    tutor: {
      id: '',
      familyName: '',
      givenName: '',
      email: '',
      emailSent: false,
      lectureURL: ''
    },
    students: [{
      id: '',
      familyName: '',
      givenName: '',
      email: '',
      emailSent: false,
      lectureURL: '',
      workbooks: [],
      uploaded: [],
      sharedBoards: []
    }]
  }
}

const mutations = {
  [SET_LECTURE] (state, payload) {
    state.lecture = { ...payload }
    state.lecture.tutor = { ...payload.tutor }
    state.lecture.students = [];
    for (const student of payload.students) {
      const workbooks = [];
      for (const workbook of student.workbooks) {
        workbooks.push({ ...workbook })
      }
      state.lecture.students.push({ ...student, workbooks: [...workbooks] })
    }
  },
  [CLEAR_LECTURE] (state, payload) {
    state.lecture.id = ''
    state.lecture.startTime = ''
    state.lecture.endTime = ''
    state.lecture.tutor = {
      id: '',
      familyName: '',
      givenName: '',
      email: '',
      emailSent: false,
      URL: ''
    }
    state.lecture.students = [{
      id: '',
      familyName: '',
      givenName: '',
      email: '',
      emailSent: false,
      URL: '',
      workbooks: []
    }]
  }
}

const actions = {
  [SET_LECTURE_ACTION] (context, data) {
    context.commit('SET_LECTURE', data)
  },
  [CLEAR_LECTURE_ACTION] (context, data) {
    context.commit('CLEAR_LECTURE', data)
  }
}

const getters = {
  getLecture (state) {
    return state.lecture
  }
}

export default {
  state,
  actions,
  mutations,
  getters
}
