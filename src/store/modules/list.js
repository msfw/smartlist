import { uuid } from 'vue-uuid'
import { http } from '../http-common';
import router from '../../router';

const state = {
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
  editingList: { },
  item: {
    sku: '',
    description: '',
    value: 0,
    checked: false
  },
  error: ''
}

const getters = {
  itemsForList: state => listSku => {
    var list = state.lists.find(x => x.sku == listSku)
    if (list) return list.items
    else return []
  },
  getListId: state => listSku => {
    const list = state.lists.find(x => x.sku == listSku);
    if (list)
      return list._id;
    else return '';
  }
}
const mutations = {
  createAndViewList(state, payload) {
    state.editingList = {
      _id: '',
      sku: uuid.v1(),
      name: '',
      items: [],
      type: payload.listType,
      created: false,
      synchronized: false,
      createdAt: new Date()
    }

    router.push('list/' + state.editingList.sku);
  },
  editAndViewList(state, { listSku }) {
    var list = state.lists.find(l => l.sku === listSku)
    if (!list) {
      state.error = 'The list does not exists.'
      return;
    }

    var copyList = {};
    Object.assign(copyList, list);
    state.editingList = copyList

    router.push('list/' + listSku);
  },


  // obsoleto
  /*
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

    router.push('list/' + list.sku);
  },
  editList(state, payload) {
    //state.list = state.lists.find(x => x.sku == payload.sku);
  },*/
  updateListName(state, payload) {
    let list = state.lists.find(x => x.sku == payload.sku);

    if (list) {
      list.name = payload.text;
      list.synchronized = false;
    }
  },
  deleteList(state, sku) {
    state.lists = state.lists.filter(x => x.sku !== sku);
  },
  setSynchronized(state, id) {
    let list = state.lists.find(x => x._id == id);
    list.synchronized = true;
    //state.list = state.lists.find(x => x._id == id);
    //state.list.synchronized = true;
  },
  setIdForList(state, payload) {
    let list = state.lists.find(x => x.sku == payload.sku);
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
  }
}

const actions = {
  async persistList({ state, commit }, postLists) {
    var data = [];
    postLists.forEach(element => {
      data.push({
        user: {
          email: state.user.email
        },
        name: element.name,
        sku: element.sku,
        items: element.items,
        type: element.type
      })
    });

    await http.post('/list', data,
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
    commit('deleteList', payload.listSku)
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
          params: { userEmail: getters.getUserEmail },
          headers: { Authorization: `Bearer ${ getters.getUserToken }` }
        })
        .then(response => {
          if (state.lists.length > 0) {
            var existing = new Set(state.lists.map(d => d.sku));
            var merged = [...state.lists, ...response.data.lists.filter(d => !existing.has(d.sku))];

            commit('loadList', merged)
          }
          else
            commit('loadList', response.data.lists);
        }).catch(error => {
          var errormsg = '';
          if (error.response) {
            errormsg = error.response.data.error ? error.response.data.error : 'An error has occurred while loading your lists.'
          } else if (error.request) {
            errormsg = error.request
          } else {
            errormsg = error.message
          }
          console.log(errormsg);
        })
    }
  },

  updateValue({ commit }, payload) {
    commit('updateValue', payload);
  },
  rollbackList({ commit }, payload) {
    commit('updateValue', payload);
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
    }

    dispatch('loadList');
  }
}

export default {
  //namespaced: true,
  state,
  mutations,
  actions,
  getters
}
