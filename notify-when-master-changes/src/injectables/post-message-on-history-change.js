const HISTORY_CHANGE_MESSAGE = 'stm:page-changed';

const postMessageOnHistoryChange = function() {
  // let pushState = history.pushState;
  // history.pushState = function () {
  //   console.log('CUSTOM pushState');
  //   window.postMessage( HISTORY_CHANGE_MESSAGE, '*' );
  //   return pushState.apply( this, arguments );
  // };

  let replaceState = history.replaceState;
  history.replaceState = function() {
    window.postMessage(HISTORY_CHANGE_MESSAGE, '*');
    return replaceState.apply(this, arguments);
  };
};

export { HISTORY_CHANGE_MESSAGE, postMessageOnHistoryChange };
