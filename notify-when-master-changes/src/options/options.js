import Vue from 'vue';
import App from './App';
import AsyncComputed from 'vue-async-computed';

Vue.use(AsyncComputed);

if (window.Element && !Element.prototype.closest) {
  Element.prototype.closest = function(s) {
    var matches = (this.document || this.ownerDocument).querySelectorAll(s),
      i,
      el = this;
    do {
      i = matches.length;
      while (--i >= 0 && matches.item(i) !== el) {}
    } while (i < 0 && (el = el.parentElement));
    return el;
  };
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App),
});
