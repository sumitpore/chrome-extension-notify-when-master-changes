import autoBind from 'auto-bind';
import { getRepoIdentifierFromUrl, isRepoStoredInStorage, saveRepoInfoInStorage, removeRepoInfoFromStorage } from '../utils';

class SubscribeToMasterBtn {
  props = {
    checkedMarkSvg: `<svg class="v-align-text-bottom" width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="8" cy="8" r="8" fill="#42C55F"/><path d="M4 8l2 3 6.5-4.5" stroke="#95FDAC"/></svg>`,
    subscribeBtnClass: 'stm-subscribe',
    subscribedBtnClass: 'stm-subscribed',
  };

  constructor() {
    autoBind(this);
  }

  async setupBtn(forceRender = false) {
    this.addPageActionElementInProps();
    this.addRepoIdentifierInProps();

    if (!this.props.repoIdentifier) {
      return;
    }

    await this.renderBtn(forceRender);
    this.addClickListenerOnBtn();
  }

  addPageActionElementInProps() {
    this.props = { ...this.props, pageActions: document.querySelector('.pagehead-actions') };
  }

  addRepoIdentifierInProps() {
    this.props = { ...this.props, repoIdentifier: getRepoIdentifierFromUrl(document.URL) };
  }

  async renderBtn(force = false) {
    if (force) {
      let btn = document.querySelector('.btn-stm');
      if (btn !== null) {
        btn.parentNode.remove();
      }
    }

    if (!(await isRepoStoredInStorage(this.props.repoIdentifier))) {
      this.showSubscribeBtn();
    } else {
      this.showSubscribedBtn();
    }
  }

  showSubscribeBtn() {
    if (this.props.pageActions === null) {
      return;
    }
    let subscribeToMasterItem = document.createElement('li');
    subscribeToMasterItem.innerHTML = `<button class="btn btn-sm btn-stm ${this.props.subscribeBtnClass}"> Subscribe to Master</button>`;
    this.props.pageActions.insertBefore(subscribeToMasterItem, this.props.pageActions.firstChild);
  }

  showSubscribedBtn() {
    if (this.props.pageActions === null) {
      return;
    }

    let subscribedToMasterItem = document.createElement('li');
    subscribedToMasterItem.innerHTML = `<button class="btn btn-sm btn-stm ${this.props.subscribedBtnClass}">${this.props.checkedMarkSvg} Subscribed to Master</button>`;
    this.props.pageActions.insertBefore(subscribedToMasterItem, this.props.pageActions.firstChild);
  }

  addClickListenerOnBtn() {
    let subscribeBtn = document.querySelector(`.${this.props.subscribeBtnClass}`);
    if (subscribeBtn !== null) {
      subscribeBtn.addEventListener('click', this.addRepoToSubscriptionList);
    }

    let subscribedBtn = document.querySelector(`.${this.props.subscribedBtnClass}`);
    if (subscribedBtn !== null) {
      subscribedBtn.addEventListener('click', this.removeRepoFromSubscriptionList);
    }
  }

  async addRepoToSubscriptionList() {
    if (await isRepoStoredInStorage(this.props.repoIdentifier)) {
      return;
    }

    let repoInfo = {
      id: this.props.repoIdentifier,
    };
    saveRepoInfoInStorage(this.props.repoIdentifier, repoInfo);
    this.setupBtn(true);
  }

  async removeRepoFromSubscriptionList() {
    if (!(await isRepoStoredInStorage(this.props.repoIdentifier))) {
      return;
    }

    removeRepoInfoFromStorage(this.props.repoIdentifier);
    this.setupBtn(true);
  }

  static getInstance(forceNew = false) {
    if (typeof SubscribeToMasterBtn.instance == 'undefined' || forceNew) {
      SubscribeToMasterBtn.instance = new SubscribeToMasterBtn();
    }

    return SubscribeToMasterBtn.instance;
  }

  static addBtnInDom() {
    SubscribeToMasterBtn.getInstance().setupBtn();
  }
}

export default SubscribeToMasterBtn;