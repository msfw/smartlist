export default {
  bind: function(el, binding, vnode) {
    console.log('bind');
    el.clickOutsideEvent = function(event) {
      console.log('outside event', el, event.target);
      // here I check that click was outside the el and his childrens
      if (!(el == event.target || el.contains(event.target))) {
        console.log('chama outside event');
        // and if it did, call method provided in attribute value
        vnode.context[binding.expression](event);
      }
    };
    document.querySelector('div').addEventListener('click', el.clickOutsideEvent);
    //document.addEventListener("click", el.clickOutsideEvent);
  },
  unbind: function(el) {
    document.querySelector('div').addEventListener('click', el.clickOutsideEvent);
    //document.removeEventListener("click", el.clickOutsideEvent);
  }
};
