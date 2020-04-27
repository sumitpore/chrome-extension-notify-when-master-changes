let injectFnInDom = function(fn) {
  var script = document.createElement('script');
  var parent = document.documentElement;
  script.textContent = '(' + fn + ')();';
  parent.appendChild(script);
  // parent.removeChild(script);
};

export default injectFnInDom;
