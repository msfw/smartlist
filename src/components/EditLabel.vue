<template>
  <div class="container-edit-label" :class="{readonly: !editMode}">
      <input class="input-border" v-if="editMode" type="text" v-focus @focusout="exitEdit" @keypress.enter="exitEdit" v-model="inputText" :placeholder="placeHolder"/>
      <span v-if="!editMode" @click="enterEdit">{{ inputText }}</span>
  </div>
</template>
<script>
export default {
  props: {
    text: {
      type: String,
      default: ''
    },
    editing: {
      type: Boolean,
      default: true
    },
    readonly: {
      type: Boolean,
      default: false
    },
    showUntitled: {
      type: Boolean,
      default: false
    },
    placeHolder:{
      type: String,
      default: ''
    }
  },
  data() {
    return {
      editMode: true,
      inputText: ''
    }
  },
  methods: {
    exitEdit() {
      if (this.readonly) return;

      this.editMode = false;
      if (this.showUntitled && this.inputText == '')
        this.inputText = 'Untitled'
      this.$emit('cel-change', this.inputText);
    },
    enterEdit() {
      this.editMode = true;
    }
  },
  created () {
    this.inputText = this.text;
    this.editMode = this.editing;
  }
}
</script>
<style scoped>
.container-edit-label {
  display: inline;  
}
</style>
