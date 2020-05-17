class BrowserNotificationsService {
  static dispatch(title, message, callback = '') {
    let cb = () => {
      console.log('Browser Notification Callback Error:', chrome.runtime.lastError);
    };

    if (typeof callback == 'function') {
      cb = callback;
    }

    chrome.notifications.create(
      {
        type: 'basic',
        iconUrl: 'icons/icon_128.png',
        title: title,
        message: message,
        priority: 0,
      },
      cb
    );
  }

  static dispatchNewCommitsNotification(reposList = []) {
    if (!Array.isArray(reposList) || reposList.length === 0) {
      return;
    }

    const message = reposList.join(',');

    // Open dashboard when user clicks the notification. notification id is
    // passed by chrome.notifications.create api
    const onClickcallback = function(notificationId) {
      chrome.notifications.onClicked.addListener(function() {
        chrome.tabs.create({ url: 'dashboard/dashboard.html' });
        chrome.notifications.clear(notificationId);
      });
      console.log('Browser Notification Callback Error: ', chrome.runtime.lastError);
    };

    BrowserNotificationsService.dispatch('New Commits Found', message, onClickcallback);
  }
}

export default BrowserNotificationsService;
