<template>
  <div id="app" class="wrapper">
    <router-view name="header"></router-view>
    <main>
      <fade-transition origin="center" mode="out-in" :duration="250">
        <router-view class="app-content"/>
      </fade-transition>
    </main>
    <router-view name="footer">asdasd</router-view>
  </div>
</template>
<script>
import { FadeTransition } from "vue2-transitions";

export default {
  components: {
    FadeTransition
  }
};
</script>
<style lang="scss">

</style>
