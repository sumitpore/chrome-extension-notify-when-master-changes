const injectFnInDom = function(fn) {
  const script = document.createElement('script');
  const parent = document.documentElement;
  script.textContent = `(${fn})();`;
  parent.appendChild(script);
};

export default injectFnInDom;
