import clickOutside from "../directives/click-ouside.js";
//import focus from "../directives/focus";

const GlobalDirectives = {
  install(Vue) {
    Vue.directive("clickoutside", clickOutside);
    Vue.directive('focus', {
      inserted: function (el) {
        el.focus()
      }
    });
  }
};

export default GlobalDirectives;
