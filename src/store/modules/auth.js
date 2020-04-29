import { http } from '../http-common';
import { createI18n } from '../../i18n/index'

const state = {
  user: {
    name: '',
    token: '',
    email: ''
  },
  requestingToken: false,
  requestingEmail: '',
  error: ''
}

const getters = {
  isLoggedIn: state => {
    return state.user.token !== '';
  },
  getUserName: state => {
    return state.user.name;
  },
  getUserEmail: state => {
    return state.user.email;
  },
  getUserToken: state => {
    return state.user.token;
  },
  isRequestingToken: state => {
    return state.requestingToken;
  }
}

const mutations = {
  forgotpass_success(state, { email }) {
    state.requestingToken = true;
    state.requestingEmail = email;
  },
  changepass_success(state) {
    state.requestingToken = false;
    state.requestingEmail = '';
  },
  cancelToken(state) {
    state.requestingToken = false;
    state.requestingEmail = '';
  },

  login() {

  },
  logout(state) {
    state.user.email = '';
    state.user.name = ''
    state.user.token = ''
  },
  login_success(state, { user, token }) {
    state.user.name = user.name;
    state.user.email = user.email;
    state.user.token = token;
  },
  auth_error(state, error) {
    var errormsg = '';
    if (error.response) {
      if (error.response.data) {
        if (error.response.data.error)
          errormsg = error.response.data.error
        else
          errormsg = error.response.data
      } else
      errormsg = createI18n().t('labels.operationFailed')
    } else if (error.request) {
      errormsg = createI18n().t('labels.connectionRefused')
    } else {
      errormsg = error.message
    }
    state.error = errormsg;
  },
}

const actions = {
  login({ commit, dispatch }, payload) {
    commit('login');
    http.post('/auth/authenticate', {
      email: payload.email,
      password: payload.password
    })
    .then(response => {
      commit('login_success', response.data);
      dispatch('synchronize');
    })
    .catch(e => {
      commit('auth_error', e);
    });
  },
  logout({ commit }) {
    //localStorage.removeItem("token");
    commit('logout');
  },
  register({ commit }, payload) {
    http.post('/auth/register', {
      name: payload.name,
      email: payload.email,
      password: payload.password
    })
    .then(response => {
      commit('login_success', response.data);
    })
    .catch(e => {
      commit('auth_error', e);
    });
  },
  forgotPassword({ commit }, { email }) {
    http.post('/auth/forgotPassword', { email })
    .then(response => {
      commit('forgotpass_success', { data: response.data, email: email });
    })
    .catch(e => {
      commit('auth_error', e);
    });
  },
  resetPassword({ state, getters, commit }, { password, oldPassword, token }) {
    const manualReset = !getters.isRequestingToken
    const email = state.requestingEmail || getters.getUserEmail
    http.post('/auth/resetPassword', { newPassword: password, oldPassword, token, email, manualReset })
    .then(() => {
      commit('changepass_success');
    })
    .catch(e => {
      commit('auth_error', e);
    });
  }
}

export default {
  //namespaced: true,
  state,
  mutations,
  actions,
  getters
}
