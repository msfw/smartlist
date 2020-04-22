<template>
  <div class="container">

    <button type="button" @click="$router.push('/')" class="btn btn-outline-orange">Home</button>

    <div class="d-flex justify-content-between list-header">
      <edit-label
        :editing="name == ''"
        :text="name"
        show-untitled
        @cel-change="name = $event"
      />

      <button type="button" @click="showAddItemInput()" v-if="!itemInputVisible" :key="itemInputVisible" class="btn btn-link btn-link-add">Add item <i  class="fas fa-plus"></i></button>
      <button type="button" @click="hideAddItemInput()" v-else :key="itemInputVisible" class="btn btn-link btn-link-remove">Cancel <i  class="fas fa-times"></i></button>
    </div>

    <div
      class="d-flex item-container list-item new-item-container" v-if="itemInputVisible"
    >
      <div class="p-2">
        <input
          type="text"
          v-focus
          v-model="newItemText"
          @keydown.enter="createItem"
          @keydown.esc="hideAddItemInput()"
          @focusout="!newItemText && hideAddItemInput()"
        >
      </div>

    </div>

    <div v-if="$store.state.lists.find(l => l.sku === this.listSku)" :key="this.listSku">
      <div
        class="item-container"
        v-for="item in $store.state.lists.find(l => l.sku === this.listSku).items.filter(i => !i.checked)"
        :key="item.sku"
      >

        <list-item
          :checked="item.checked"
          :description="item.description"
          :sku="item.sku"
          @name-change="changeItemText($event, item.sku)"
          @itemCheck="check(item.sku)"
          @delete="deleteItem(item.sku)"
        >
        </list-item>

      </div>
    </div>

    <div v-if="$store.state.lists.find(l => l.sku === this.listSku).items.filter(i => i.checked).length > 0">
      <h5 class="item-header text-muted">Done</h5>

      <div
        class="item-container"
        v-for="item in $store.state.lists.find(l => l.sku === this.listSku).items.filter(i => i.checked)"
        :key="item.sku"
        @click.stop="check(item)"
      >

        <list-item
          :checked="item.checked"
          :description="item.description"
          :sku="item.sku"
          @name-change="changeItemText($event, item.sku)"
          @itemCheck="check(item.sku)"
          @delete="deleteItem(item.sku)"
        >
        </list-item>

      </div>
    </div>

    <div class="items-footer">
      <button class="btn btn-outline-danger" @click="deleteList()">Delete list</button>
    </div>


  </div>
</template>
<script>
import EditLabel from '../components/EditLabel'
import ListItem from '../components/ListItem'
import _ from 'lodash'

export default {
  components: {
    ListItem, EditLabel
  },
  data() {
    return {
      modal: {
        visible: false,
        description: ''
      },
      itemInputVisible: false,
      newItemText: '',
      listSku: '',
      listId: '',
      renderUnchecked: false
    }
  },
  computed: {
    list() {
      return this.$store.state.lists.find(x => x.sku === this.listSku);
    },
    name: {
      get () {
        let list = this.$store.state.lists.find(x => x.sku === this.listSku)
        if (list)
          return list.name
        else
          return ''
      },
      set (value) {
        this.updateListName(value);
      }
    }
  },
  created() {
    this.listSku = this.$route.params.sku;
    this.listId = this.$store.getters.getListId(this.listSku);
    this.debouncedListName = _.debounce(this.updateListName, 1500);
  },
  methods: {
    createItem() {
      if (this.newItemText == '') {
        this.hideAddItemInput();
        return;
      }

      this.$store.commit('createItem', { description: this.newItemText, listSku: this.listSku })
      this.$store.dispatch('updateList', { id: this.listId, sku: this.listSku });
      this.newItemText = ''
    },
    showAddItemInput() {
      this.itemInputVisible = true;
    },
    hideAddItemInput() {
      this.itemInputVisible = false;
      this.newItemText = ''
    },
    changeItemText(event, sku) {      
      if (event == '')
        this.deleteItem(sku)
      else
      {
        this.$store.commit('updateItemName', {text: event, sku: sku, listSku: this.listSku});
        this.$store.dispatch('updateList', { id: this.listId, sku: this.listSku });
      }
    },
    updateListName: _.debounce(function(value) {
        this.$store.dispatch('updateListName', { text: value, id: this.listId, sku: this.listSku });
    }, 100),
    check(sku) {
      this.$store.commit('checkItem', { listSku: this.listSku, sku: sku });
      this.$store.dispatch('updateList', { id: this.listId, sku: this.listSku });
    },
    deleteItem(sku) {
      this.$store.commit('deleteItem', { sku: sku, listSku: this.listSku });
      this.$store.dispatch('updateList', { id: this.listId, sku: this.listSku });
    },
    deleteList() {
      this.$store.dispatch('deleteList', { listId: this.listId, sku: this.listSku });
      this.$router.push('/');
    }
  },
  mounted() {
    this.$store.subscribe((mutation) => {
      if (mutation.type === 'setIdForList' && mutation.payload.sku == this.listSku) {
        this.listId = mutation.payload.id
      }
    })

    if (!this.list)
      this.$router.push('/')
  },
}
</script>
<style>

</style>
