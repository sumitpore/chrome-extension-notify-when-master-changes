import SubscribeToMaster from './injectables/subscribe-to-master';
import injectFnToDom from './injectables/inject-fn-to-dom';
import listenOnHistoryChangeEvent from './injectables/listen-on-history-change-event';
import { emitEventOnHistoryChange } from './injectables/emit-events-on-history-change';

// Inject function in DOM which emits event on History Change.
injectFnToDom(emitEventOnHistoryChange);

listenOnHistoryChangeEvent();

SubscribeToMaster.addSubscribeToMasterBtnInDom();
