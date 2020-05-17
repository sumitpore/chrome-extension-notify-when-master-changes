import SubscribeToMasterBtn from './injectables/subscribe-to-master-btn';
import injectFnInDom from './injectables/inject-fn-in-dom';
import listenToMessagePostedOnHistoryChange from './injectables/listen-to-message-posted-on-history-change';
import { postMessageOnHistoryChange } from './injectables/post-message-on-history-change';

/**
 * Here is a brief about workflow
 *
 * When a github page is loaded for the first time,
 * `SubscribeToMasterBtn.addBtnInDom()` adds 'Subscribe/d to
 * Master' in the DOM.
 *
 * Github uses pjax (push state and ajax) to navigate through pages. Since it
 * uses ajax to load subsequent requests, 'Subscribe/d to Master' button would
 * become unavailable after first page in natural case.
 *
 * To avoid this, we are injecting a function `postMessageOnHistoryChange` in the dom which will post
 * a message when state of the history is replaced. `listenToMessagePostedOnHistoryChange`
 * can listen to that message & when a new message is detected, 'Subscribe/d to Master'
 * button is again added into the dom.
 *
 * @see https://github.com/thieman/github-selfies/blob/master/chrome/selfie.js
 */

// Inject function in DOM which posts a message on History Change.
injectFnInDom(postMessageOnHistoryChange);

listenToMessagePostedOnHistoryChange();

// Add button in DOM on first Load
SubscribeToMasterBtn.addBtnInDom();
