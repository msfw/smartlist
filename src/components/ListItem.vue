<template>
  <div
    class="d-flex item-container list-item" :class="{checked : itemChecked}"
    @click.stop="check()"
  >
    <div class="p-2" :key="checkIcon" >
        <i :class="checkIcon" class=""></i>
        <edit-label
          :editing="editing"
          :readonly="!editing"
          :text="description"
          :key="editing"
          @cel-change="textChanged"
        >
        </edit-label>
    </div>

    <div class="p-2" >
      <button class="btn btn-item" @click.stop="editItem()"><i class="fa fa-edit"></i></button>
      <button class="btn btn-item" @click.stop="deleteItem()"><i class="fa fa-trash"></i></button>
    </div>
  </div>
</template>
<script>
import EditLabel from '../components/EditLabel'

export default {
  components: {
    EditLabel
  },
  props: {
    sku: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    },
    checked: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    checkIcon() {
      if (this.itemChecked) return 'fas fa-circle';
      else return 'far fa-circle';
    },
    editing() {
      if (this.description == '')
        return true;
      else
        return this.editMode;
    }
  },
  data() {
    return {
      itemChecked: false,
      editMode: false
    }
  },
  methods: {
    textChanged(e) {
      this.editMode = false;
      this.$emit('name-change', e);
    },
    check() {
      if (this.editing) return;

      this.itemChecked = !this.itemChecked;
      this.$emit('itemCheck');
      console.log(this.itemChecked);
    },
    editItem() {
      this.editMode = true;
    },
    deleteItem() {
      this.$emit('delete', this.sku);
    }
  },
  created () {
    this.itemChecked = this.checked;
  },
}
</script>
