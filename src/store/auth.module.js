import {
  SET_USER_ACTION,
  SET_SUCCESS_MSG_ACTION,
  SET_ERROR_MSG_ACTION,
  SET_APIGCLIENT_ACTION,
  SET_ISLOGGEDIN_ACTION,
  SET_JWTTOKEN_ACTION
} from './actionTypes';

import {
  SET_USER,
  SET_SUCCESS_MSG,
  SET_ERROR_MSG,
  SET_APIGCLIENT,
  SET_ISLOGGEDIN,
  SET_JWTTOKEN
} from './mutationTypes';


const state = {
  user: null,
  successMsg: null,
  errorMsg: null,
  isLoggedIn: false,
  apigClient: null,
  jwtToken: null
}

const mutations = {
  [SET_USER] (state, payload) {
    state.user = payload
  },
  [SET_SUCCESS_MSG] (state, payload) {
    state.successMsg = payload
  },
  [SET_ERROR_MSG] (state, payload) {
    state.errorMsg = payload
  },  
  [SET_ISLOGGEDIN] (state, payload) {
    state.isLoggedIn = payload
  },
  [SET_JWTTOKEN] (state, payload) {
    state.jwtToken = payload
  },
  [SET_APIGCLIENT] (state, payload) {
    state.apigClient = payload
  }
}

const actions = {
  [SET_USER_ACTION] (context, user) {
    context.commit(SET_USER, user)
  },
  [SET_SUCCESS_MSG_ACTION] (context, successMsg) {
    context.commit(SET_SUCCESS_MSG, successMsg)
  },
  [SET_ERROR_MSG_ACTION] (context, errorMsg) {
    context.commit(SET_ERROR_MSG, errorMsg)
  },  
  [SET_ISLOGGEDIN_ACTION] (context, data) {
    context.commit(SET_ISLOGGEDIN, data)
  },
  [SET_JWTTOKEN_ACTION] (context, data) {
    context.commit(SET_JWTTOKEN, data)
  },
  [SET_APIGCLIENT_ACTION] (context, data) {
    context.commit(SET_APIGCLIENT, data)
  }
}

const getters = {
  getUser (state) {
    return state.user
  },
  getSuccessMsg (state) {
    return state.successMsg
  },
  isLoggedIn: (state) => state.isLoggedIn,
  getJwtToken: (state) => state.jwtToken,
  getApigClient (state) {
    return state.apigClient
  }
}

export default {
  state,
  actions,
  mutations,
  getters
}
