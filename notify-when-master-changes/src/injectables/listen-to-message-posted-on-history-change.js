import SubscribeToMaster from './subscribe-to-master';
import { MESSAGE } from './emit-events-on-history-change';

const listenToMessagePostedOnHistoryChange = function() {
  window.addEventListener('message', function(event) {
    if (event.data === MESSAGE) {
      SubscribeToMaster.addSubscribeToMasterBtnInDom();
    }
  });
  window.addEventListener('popstate', SubscribeToMaster.addSubscribeToMasterBtnInDom);
};

export default listenToMessagePostedOnHistoryChange;
