import SubscribeToMaster from './subscribe-to-master';
import { EVENT_TAG } from './emit-events-on-history-change';

const listenOnHistoryChangeEvent = function() {
  window.addEventListener('message', function(event) {
    if (event.data === EVENT_TAG) {
      SubscribeToMaster.addSubscribeToMasterBtnInDom();
    }
  });
  window.addEventListener('popstate', SubscribeToMaster.addSubscribeToMasterBtnInDom);
};

export default listenOnHistoryChangeEvent;
