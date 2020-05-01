<template>
  <div class="container">

    <h1>{{ $t('labels.myLists') }}</h1>
    <div class="column">
      <button type="button" @click="newList()" class="btn btn-outline-orange btn-circle btn-lg">
        <i class="fas fa-plus"/>
      </button>
      <p >{{ $t('labels.newList') }}</p>
    </div>

    <div class="scroll-area"  >
      <div class="mylist-content">

          <div class="card cardlist align-left shadow" style="width: 18rem;"
            v-for="list in $store.state.list.lists"
            :key="list.sku"
            @click.stop="editList(list.sku)"
          >
            <div class="card-body">
              <div class="d-flex">
                <h5 class="card-title flex-grow-1">{{ list.name }}</h5>

                <base-button
                  @click.stop="deleteList(list.sku, list._id)"
                  size="sm"
                  type="danger orange btn-delete-list"
                  icon="fa fa-trash">
                </base-button>
              </div>

              <h6 class="card-subtitle mb-2">{{ getDate(list.createdAt) }}</h6>

              <div v-if="list.items && list.items.length > 0">
                <div class="card-text"
                  v-for="item in getOrderedItems(list.items)"
                  :key="item.sku"
                >
                  <i class="fas fa-check" :class="item.checked || 'invisible'"/>
                  <p>
                    {{item.description}}
                  </p>
                </div>
              </div>
              <div v-else class="text-center no-items-container" style="height: 200px">
                {{ $t('labels.noItems') }}
              </div>

              <a v-if="false" href="#" class="card-link">Card link</a>
            </div>

            <div v-if="list.type == 1" class="card-footer d-flex justify-content-between align-items-center">
              <div class="total-desc">{{ $t('labels.total') }}</div>
              <div class="total-value">{{ listTotalValue(list.items) }}</div>
            </div>
          </div>
        </div>
      </div>

  </div>

</template>
<script>
import moment from 'moment'
//import vueCustomScrollbar from 'vue-custom-scrollbar'
//import vuescroll from 'vuescroll';

export default {
  components: {
    //Modal,
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
      this.$store.commit('editAndViewList', { listSku: sku });
    },
    newList() {
      this.$store.commit('createAndViewList', { listType: this.modal.listType});
    },
    deleteList(sku, id) {
      this.$store.dispatch('deleteList', { listId: id, listSku: sku });
    },
    listTotalValue(items) {
      var total = 0;
      items.filter(i => i.checked).forEach(v => total += v.value);
      return new Intl.NumberFormat(this.$t('labels.locale'), { style: 'currency', currency: this.$t('labels.currency') }).format(total);
    },
    getOrderedItems(items) {
      var unchecked = items.filter(i => !i.checked);
      if (unchecked && unchecked.length >= 5)
        return unchecked.slice(0, 5)

      var checked = items.filter(i => i.checked);
      if (checked && checked.length > 0)
        checked.forEach(c => unchecked.push(c))

      return unchecked.slice(0, 5)
    }
  },
  created () {
    this.$store.dispatch('loadList');
  }
}
</script>
<style>

</style>
