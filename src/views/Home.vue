<template>
  <div class="container">

    <h1>My Lists</h1>
    <div class="column">
      <button type="button" @click="newList()" class="btn btn-outline-orange btn-circle btn-lg">
        <i class="fas fa-plus"/>
      </button>
      <p >New list</p>
    </div>

    <div class="scroll-area"  >
      <div class="mylist-content">

          <div class="card cardlist align-left" style="width: 18rem;"
            v-for="list in $store.state.lists"
            :key="list.sku"
            @click.stop="editList(list.sku)"
          >
            <div class="card-body">
              <div class="d-flex">
                <h5 class="card-title flex-grow-1">{{ list.name }}</h5>
                <base-button
                  @click.stop="deleteList(list.sku, list._id)"
                  size="sm"
                  type="danger btn-delete-list"
                  icon="fa fa-trash">
                </base-button>
              </div>
              <h6 class="card-subtitle mb-2 text-muted">{{ getDate(list.createdAt) }}</h6>
              <div class="card-text"
                v-for="item in list.items.slice(0, 5)"
                :key="item.sku"
              >
                <i class="fas fa-check" :class="item.checked || 'invisible'"/>
                <p>
                  {{item.description}}
                </p>
              </div>

              <a v-if="false" href="#" class="card-link">Card link</a>
            </div>
          </div>
        </div>
      </div>

    <modal :show.sync="modal.visible">
      <h6 slot="header" class="modal-title" id="modal-title-default">New list</h6>

      <label for="typeSelect">List type</label>
      <select class="form-control" id="typeSelect" v-model="modal.listType">
        <option value="0">Select a type</option>
        <option value="1">Normal</option>
        <option value="2">Priced</option>
      </select>

      <template slot="footer">
        <base-button type="primary" @click="newList">Save changes</base-button>
        <router-link to="/list" tag="button" class="btn btn-primary">Select</router-link>
        <base-button type="link" class="ml-auto" @click="modal.modal1 = false">Close
        </base-button>
      </template>
    </modal>
  </div>

</template>
<script>
import Modal from '../components/Modal'
import moment from 'moment'
//import vueCustomScrollbar from 'vue-custom-scrollbar'
//import vuescroll from 'vuescroll';

export default {
  components: {
    Modal,
    //vuescroll
    //vueCustomScrollbar
  },
  data() {
    return {
      modal: {
        visible: false,
        listType: 0
      }
    }
  },
  methods: {
    getDate(createdAt) {
      return moment(createdAt).format("DD/MM/YYYY")
    },
    showModal() {
      this.modal.visible = true
    },
    editList(sku) {
      //this.$router.push('/list/'+sku);
      this.$store.commit('editAndViewList', { listSku: sku });
      //this.$store.commit('editList', { sku });
    },
    newList() {
      //this.$store.commit('newList', { listType: this.modal.listType});
      this.$store.commit('createAndViewList', { listType: this.modal.listType});
    },
    deleteList(sku, id) {
      this.$store.dispatch('deleteList', { listId: id, listSku: sku });
    }
  },
  created () {
    this.$store.dispatch('loadList');
  }
}
</script>
<style>

</style>
