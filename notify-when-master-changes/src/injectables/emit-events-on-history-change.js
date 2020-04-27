const EVENT_TAG = 'stm:page-changed';

const emitEventOnHistoryChange = function() {
  // let pushState = history.pushState;
  // history.pushState = function () {
  //   console.log('CUSTOM pushState');
  //   window.postMessage( EVENT_TAG, '*' );
  //   return pushState.apply( this, arguments );
  // };

  let replaceState = history.replaceState;
  history.replaceState = function() {
    window.postMessage(EVENT_TAG, '*');
    return replaceState.apply(this, arguments);
  };
};

export { EVENT_TAG, emitEventOnHistoryChange };
