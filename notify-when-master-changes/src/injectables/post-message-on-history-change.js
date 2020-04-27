const MESSAGE = 'stm:page-changed';

const postMessageOnHistoryChange = function() {
  // let pushState = history.pushState;
  // history.pushState = function () {
  //   console.log('CUSTOM pushState');
  //   window.postMessage( MESSAGE, '*' );
  //   return pushState.apply( this, arguments );
  // };

  let replaceState = history.replaceState;
  history.replaceState = function() {
    window.postMessage(MESSAGE, '*');
    return replaceState.apply(this, arguments);
  };
};

export { MESSAGE, postMessageOnHistoryChange };
