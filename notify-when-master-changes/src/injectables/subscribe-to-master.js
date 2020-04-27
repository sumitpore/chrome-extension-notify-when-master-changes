import md5 from 'blueimp-md5';
import autoBind from 'auto-bind';

class SubscribeToMaster {
  props = {
    checkedMarkSvg: `<svg class="v-align-text-bottom" width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="8" cy="8" r="8" fill="#42C55F"/><path d="M4 8l2 3 6.5-4.5" stroke="#95FDAC"/></svg>`,
    subscribeBtnClass: 'stm-subscribe',
    subscribedBtnClass: 'stm-subscribed',
  };

  constructor() {
    autoBind(this);
  }

  setupBtn(forceRender = false) {
    this.addPageActionElementInProps();
    this.renderBtn(forceRender);
    this.addClickListenerOnBtn();
  }

  addPageActionElementInProps() {
    this.props = { ...this.props, pageActions: document.querySelector('.pagehead-actions') };
  }

  renderBtn(force = false) {
    if (force) {
      let btn = document.querySelector('.btn-stm');
      if (btn !== null) {
        btn.parentNode.remove();
      }
    }
    if (force) {
      this.showSubscribedBtn();
    } else {
      this.showSubscribeBtn();
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

  addRepoToSubscriptionList() {
    this.setupBtn(true);
  }

  static getInstance(forceNew = false) {
    if (typeof SubscribeToMaster.instance == 'undefined' || forceNew) {
      SubscribeToMaster.instance = new SubscribeToMaster();
    }

    return SubscribeToMaster.instance;
  }

  static addSubscribeToMasterBtnInDom() {
    SubscribeToMaster.getInstance().setupBtn();
  }
}

export default SubscribeToMaster;
