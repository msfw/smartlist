import { http } from '../http-common';

const state = {
  user: {
    name: '',
    token: '',
    email: ''
  }
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
  }
}

const mutations = {
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
  login_error(state, error) {
    var errormsg = '';
    if (error.response) {
      errormsg = error.response.data.error ? error.response.data.error : 'Failed to login, try again later.'
    } else if (error.request) {
      errormsg = error.request
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
      commit('login_error', e);
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
      commit('login_error', e);
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
