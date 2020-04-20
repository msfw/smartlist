import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersist from 'vuex-persist'
import { uuid } from 'vue-uuid'
import { http } from './http-common';
import router from '../router';

Vue.use(Vuex)

const vuexLocalStorage = new VuexPersist({
  key: 'smarket-list',
  storage: window.localStorage
})

export default new Vuex.Store({
  state: {
    user: {
      name: '',
      token: '',
      email: ''
    },
    lists: [],
    list: {
      _id: '',
      sku: '',
      name: '',
      items: [],
      type: 0,
      value: 0,
      synchronized: false,
      createdAt: new Date()
    },
    item: {
      sku: '',
      description: '',
      value: 0,
      checked: false
    }
  },
  getters: {
    itemsForList: state => listSku => {
      const list = state.lists.find(x => x.sku == listSku);
      return list.items;
    },
    isLoggedIn: state => {
      return state.user.token !== '';
    },
    getListId: state => sku => {
      const list = state.lists.find(x => x.sku == sku);
      return list._id;
    }
  },
  mutations: {
    newList(state, payload) {
      const list = {
        _id: '',
        sku: uuid.v1(),
        name: '',
        items: [],
        type: payload.listType,
        created: false,
        synchronized: false,
        createdAt: new Date()
      }
      const newList = [
        ...state.lists,
        list
      ]
      state.lists = newList;
      //state.lists.push(list);
      router.push('list/' + list.sku);
    },
    /*editList(state, payload) {
      //state.list = state.lists.find(x => x.sku == payload.sku);
    },*/
    updateListName(state, payload) {
      const list = state.lists.find(x => x.sku == payload.sku);

      list.name = payload.text;
      list.synchronized = false;
    },
    deleteList(state, sku) {
      state.lists = state.lists.filter(x => x.sku !== sku);
    },
    setSynchronized(state, id) {
      const list = state.lists.find(x => x._id == id);
      list.synchronized = true;
      //state.list = state.lists.find(x => x._id == id);
      //state.list.synchronized = true;
    },
    setIdForList(state, payload) {
      const list = state.lists.find(x => x.sku == payload.sku);
      list._id = payload.id;

      //state.list = state.lists.find(x => x.sku == payload.sku);
      //state.list._id = payload.id;
    },
    loadList(state, newList) {
      state.lists = newList
    },
    checkItem(state, payload) {
      var item = state.lists.find(x => x.sku == payload.listSku).items.find(i => i.sku === payload.sku);
      item.checked = !item.checked;
    },
    updateItemName(state, payload) {
      var item = state.lists.find(x => x.sku == payload.listSku).items.find(i => i.sku === payload.sku);
      item.description = payload.text;
      if (item.sku == '')
        item.sku = uuid.v1();

      // update list object
      //state.list = state.lists.find(x => x.sku == payload.listSku);
    },
    createItem(state, payload) {
      state.lists.find(x => x.sku == payload.listSku).items.unshift({
        sku: uuid.v1(),
        description: payload.description,
        value: 0,
        checked: false
      });

      // update list object
      //state.list = state.lists.find(x => x.sku == payload.listSku);
    },
    deleteItem(state, payload) {
      var items = state.lists.find(x => x.sku == payload.listSku).items;
      state.lists.find(x => x.sku == payload.listSku).items = items.filter(i => i.sku !== payload.sku);

      // update list object
      //state.list = state.lists.find(x => x.sku == payload.listSku);
    },

    login() {

    },
    logout(state) {
      state.user.email = '';
      state.user.name = ''
      state.user.token = ''
    },
    login_success(state, payload) {
      state.user.name = payload.user.name;
      state.user.email = payload.user.email;
      state.user.token = payload.token;
    },
    login_error() {
    }
  },
  actions: {
    async persistList({ state, commit }, postLists) {
      await http.post('/list', postLists,
        {
          headers: { Authorization: `Bearer ${state.user.token}` }
        })
        .then(response => {
          response.data.lists.forEach(el => {
            commit('setIdForList', { id: el._id, sku: el.sku });
          });
        });
    },
    updateListName({ commit, getters, dispatch }, payload) {
      commit('updateListName', payload)
      if (getters.isLoggedIn)
        dispatch('updateList', payload)
    },
    deleteList({ state, commit, getters }, payload) {
      commit('deleteList', payload.sku)
      if (getters.isLoggedIn && payload.listId) {
        http.delete('/list/' + payload.listId,
          {
            headers: { Authorization: `Bearer ${state.user.token}` }
          });
      }
    },
    updateList({ state, commit, dispatch }, payload) {
      const list = state.lists.find(x => x.sku == payload.sku);

      if (payload.id == '')
        dispatch('persistList', [list])
      else {
        http.put('/list/' + payload.id,
          {
            user: {
              email: state.user.email
            },
            name: list.name,
            items: list.items
          },
          {
            headers: { Authorization: `Bearer ${state.user.token}` }
          })
          .then(() => {
            commit('setSynchronized', payload.id);
          });
      }
    },
    loadList({ state, getters, commit }) {
      if (getters.isLoggedIn) {
        http.get('/list',
          {
            params: { userEmail: state.user.email },
            headers: { Authorization: `Bearer ${state.user.token}` }
          })
          .then(response => {
            if (state.lists.length > 0) {
              var existing = new Set(state.lists.map(d => d.sku));
              var merged = [...state.lists, ...response.data.lists.filter(d => !existing.has(d.sku))];

              commit('loadList', merged)
            }
            else
              commit('loadList', response.data.lists);
          });
      }
    },

    updateValue({ commit }, payload) {
      commit('updateValue', payload);
    },
    rollbackList({ commit }, payload) {
      commit('updateValue', payload);
    },
    login({ commit, dispatch }, payload) {
      commit('login'); // show spinner
      http.post('/auth/authenticate', {
        email: payload.email,
        password: payload.password
      })
        .then(response => {
          commit('login_success', response.data);
          dispatch('synchronize');
        })
        .catch(e => {
          commit('login_error', e.response);
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
          commit('login_error', e.response);
          //this.errors.push(e)
        });
    },
    async synchronize({ state, dispatch }) {
      if (state.lists.length > 0) {
        // insert user object inside every list
        const postLists = [];
        state.lists.filter(l => l._id == '').forEach(el => {
          postLists.push({
            user: {
              email: state.user.email
            },
            name: el.name,
            sku: el.sku,
            items: el.items,
            type: el.type
          });
        });

        dispatch('persistList', postLists)

        const listsToUpdate = state.lists.filter(l => l._id !== '' && !l.synchronized);
        const promises = listsToUpdate.map(async (list) => {
          await http.put('/list/' + list._id, {
            user: {
              email: state.user.email
            },
            name: list.name,
            items: list.items
          },
            {
              headers: { Authorization: `Bearer ${state.user.token}` }
            });
        }
        );
        await Promise.all(promises);

        dispatch('loadList');
      }
      else {
        dispatch('loadList');
      }
    }
  },
  modules: {
  },
  plugins: [vuexLocalStorage.plugin]
})
