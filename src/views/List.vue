<template>
  <div class="container">

    <div class="d-flex align-items-start">
      <button type="button" @click="$router.push('/')" class="btn btn-link btn-link-orange" style="padding-left: 0px;">
        <i  class="fas fa-chevron-left"></i>
         {{ $t('buttons.home') }}
      </button>
    </div>

    <div class="d-flex justify-content-between list-header">
      <edit-label
        :editing="name == ''"
        :text="name"
        :show-untitled="false"
        @cel-change="name = $event"
      />

      <button type="button" @click="showAddItemInput()" v-if="!itemInputVisible" :key="itemInputVisible" class="btn btn-link btn-link-add">{{ $t('buttons.addItem') }} <i  class="fas fa-plus"></i></button>
      <button type="button" @click="hideAddItemInput()" v-else :key="itemInputVisible" class="btn btn-link btn-link-remove">{{ $t('buttons.cancel') }} <i  class="fas fa-times"></i></button>
    </div>

    <div class="list-settings">
      <label for="precified">{{ $t('labels.precifiedList') }} </label>
      <base-switch name="precified" v-model="listPrecified"></base-switch>

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

    <div v-if="this.list" :key="this.listSku">
      <div
        class="item-container"
        v-for="item in this.list.items.filter(i => !i.checked)"
        :key="item.sku"
      >

        <list-item
          :checked="item.checked"
          :description="item.description"
          :sku="item.sku"
          :static="true"
          @name-change="changeItemText($event, item.sku)"
          @itemCheck="check(item.sku, item.description)"
          @delete="deleteItem(item.sku)"
        >
        </list-item>

      </div>
    </div>

    <div v-if="this.list && this.list.items.filter(i => i.checked).length > 0">

      <div class="d-flex justify-content-between">
        <h5 class="item-header text-muted">{{ $t('labels.done') }}</h5>
        <h5 class="item-header text-muted orange" v-if="listPrecified">{{ totalValue }}</h5>
      </div>

      <div
        class="item-container"
        v-for="item in this.list.items.filter(i => i.checked)"
        :key="item.sku"
      >

        <list-item
          :checked="item.checked"
          :description="item.description"
          :sku="item.sku"
          :value="item.value"
          :showValue="listPrecified"
          @name-change="changeItemText($event, item.sku)"
          @itemCheck="uncheckItem(item.sku)"
          @delete="deleteItem(item.sku)"
        >
        </list-item>

      </div>
    </div>


    <div class="items-footer">
      <button class="btn btn-outline-danger" @click="deleteList()">{{ $t('buttons.deleteList') }}</button>
    </div>

    <modal :show.sync="checkmodal.visible"
          body-classes="login-modal bg-white"
          modal-classes="modal-dialog-centered modal-sm">
      <card type="secondary" shadow
            header-classes="bg-white pb-5"
            body-classes="px-lg-5 py-lg-5"
            class="border-0 bg-white">
        <template >
              <form @submit.prevent="checkItem()" role="form" style="margin-top: 20px">

                <p class="modal-input">
                  <number-input :attrs="{ class: 'form-control'}"
                    :value="checkmodal.quantity"
                    :min="1" name="numberInput"
                    @change="checkmodal.quantity = $event"
                    center controls rounded
                  ></number-input>
                </p>
                <base-input alternative
                            type="number"
                            class="modal-input block"
                            placeholder="Value"
                            addon-left-icon="fas fa-dollar-sign">

                <currency-input
                  ref="modalValue"
                  class="form-control"
                  v-model="checkmodal.value"
                  :currency="null"
                  v-focus
                  />
                </base-input>

                  <div class="d-flex justify-content-between">
                      <base-button type="default" tabindex="-1" class="my-4 btn-default" @click="checkmodal.visible = false">{{ $t('buttons.cancel') }}</base-button>
                      <base-button type="orange" nativeType="submit" class="my-4 btn-orange">{{ $t('buttons.confirm') }}</base-button>
                  </div>
                  <div v-if="checkmodal.errorMsg" class="text-center red">
                    {{ checkmodal.errorMsg }}
                  </div>
              </form>
          </template>
      </card>
    </modal>

  </div>
</template>
<script>
import EditLabel from '../components/EditLabel'
import ListItem from '../components/ListItem'
import Modal from '../components/Modal'

import _ from 'lodash'

export default {
  components: {
    ListItem, EditLabel, Modal
  },
  data() {
    return {
      checkmodal: {
        visible: false,
        errorMsg: '',
        itemSku: '',
        quantity: 1,
        value: 0
      },
      settings: {
        precified: false
      },
      itemInputVisible: false,
      newItemText: '',
      listSku: '',
      listId: '',
      renderUnchecked: false
    }
  },
  watch: {
    list: function(l) {
      if (!l)
        this.$router.push('/')
      //this.settings.precified = l.type == 1;
    }
  },
  computed: {
    list() {
      return this.$store.state.list.lists.find(x => x.sku === this.listSku);
    },
    listPrecified: {
      get() {
        if (this.list) {
          return this.list.type == 1;
        }
        return false;
      },
      set(val) {
        this.list.type = val ? 1 : 0
        this.updateList()
      }
    },
    totalValue() {
      var total = 0;
      this.list.items.filter(i => i.checked).forEach(v => total += v.value);
      return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total);
    },
    name: {
      get () {
        if (this.list)
          return this.list.name
        else
          return ''
      },
      set (value) {
        this.updateListName(value);
      }
    }
  },
  methods: {
    updateListName: _.debounce(function(value) {
      if (value === '')
        this.deleteList()
      else
        this.$store.dispatch('updateListName', { text: value, id: this.listId, sku: this.listSku });
    }, 100),

    createItem() {
      if (this.newItemText == '') {
        this.hideAddItemInput();
        return;
      }

      this.$store.commit('createItem', { description: this.newItemText, listSku: this.listSku })
      this.updateList()
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
        this.updateList()
      }
    },
    getQuantity(description) {
      var r = /\d+/g;
      var m;
      var qtd = 0;
      if ((m = r.exec(description)) != null)
        qtd = m[0];
      return parseInt(qtd);
    },
    check(sku, description) {
      // show modal
      if (this.listPrecified) {
        var qtd =this.getQuantity(description);
        this.checkmodal.quantity = qtd != 0 ? qtd : 1;
        this.checkmodal.visible = true;
        this.checkmodal.itemSku = sku;
        this.$nextTick(() => this.$refs.modalValue.$el.focus())
      }
      else
        this.uncheckItem(sku)
    },
    checkItem() {
      // calcula o valor total.
      this.$store.commit('checkItem', {
        listSku: this.listSku,
        sku: this.checkmodal.itemSku,
        value: this.checkmodal.value * this.checkmodal.quantity
      });

      if (this.listPrecified) {
        var desc = this.list.items.find(i => i.sku == this.checkmodal.itemSku).description;
        var qtd = this.getQuantity(desc);
        if (qtd == 0 && this.checkmodal.quantity > 1) {
          desc = this.checkmodal.quantity + ' ' + desc;
          this.$store.commit('updateItemName',
          {
            text: desc,
            sku: this.checkmodal.itemSku,
            listSku: this.listSku
          });
        }
      }
      this.resetModal()
      this.updateList()
    },
    uncheckItem(sku) {
     this.$store.commit('checkItem', {
        listSku: this.listSku,
        sku: sku,
        value: 0
      });
      this.resetModal()
      this.updateList()
    },
    resetModal() {
      this.checkmodal = {
        visible: false,
        errorMsg: '',
        itemSku: '',
        quantity: 1,
        value: 0
      }
    },
    deleteItem(sku) {
      this.$store.commit('deleteItem', { sku: sku, listSku: this.listSku });
      this.updateList()
    },
    deleteList() {
      this.$store.dispatch('deleteList', { listId: this.listId, listSku: this.listSku });
      this.$router.push('/');
    },

    updateList() {
      this.$store.dispatch('updateList', { id: this.listId, sku: this.listSku });
    }
  },
  mounted() {
    this.$store.subscribe((mutation) => {
      if (mutation.type === 'setIdForList' && mutation.payload.sku == this.listSku) {
        this.listId = mutation.payload.id
      }
    })
  },
  created() {
    this.listSku = this.$route.params.sku;
    this.listId = this.$store.getters.getListId(this.listSku);
    if (!this.list)
      this.$router.push('/')

    this.debouncedListName = _.debounce(this.updateListName, 1500);
  },
}
</script>
<style>

</style>
