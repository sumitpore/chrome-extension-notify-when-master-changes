import InstallationService from './background-services/installation-service';

//disable browserAction's popup
chrome.browserAction.setPopup({ popup: '' });

//Open Options Page when extension icon is clicked.
chrome.browserAction.onClicked.addListener(() => {
  chrome.tabs.create({ url: 'dashboard/dashboard.html' });
});

new InstallationService();
