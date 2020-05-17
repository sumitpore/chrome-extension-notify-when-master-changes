/* eslint-disable no-cond-assign */
/* eslint-disable no-empty */
/* eslint-disable no-plusplus */
import Vue from 'vue';
import AsyncComputed from 'vue-async-computed';
import App from './App';

Vue.use(AsyncComputed);

if (window.Element && !Element.prototype.closest) {
  Element.prototype.closest = function closest(s) {
    const matches = (this.document || this.ownerDocument).querySelectorAll(s);
    let i;
    let el = this;
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
