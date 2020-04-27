import SubscribeToMasterBtn from './subscribe-to-master-btn';
import { HISTORY_CHANGE_MESSAGE } from './post-message-on-history-change';

const listenToMessagePostedOnHistoryChange = function() {
  window.addEventListener('message', function(event) {
    if (event.data === HISTORY_CHANGE_MESSAGE) {
      SubscribeToMasterBtn.addBtnInDom();
    }
  });
  window.addEventListener('popstate', SubscribeToMasterBtn.addBtnInDom);
};

export default listenToMessagePostedOnHistoryChange;
