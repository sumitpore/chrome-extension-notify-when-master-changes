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
        title,
        message,
        type: 'basic',
        iconUrl: 'icons/icon_128.png',
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

    // notification id is passed by chrome.notifications.create api
    const onClickcallback = function(notificationId) {
      // Open dashboard when user clicks the notification.
      chrome.notifications.onClicked.addListener(function() {
        chrome.tabs.create({ url: 'dashboard/dashboard.html' });
        chrome.notifications.clear(notificationId);
      });

      // Hide Notification after 3 seconds.
      setTimeout(() => {
        chrome.notifications.clear(notificationId);
      }, 3000);

      console.log('Browser Notification Callback Error: ', chrome.runtime.lastError);
    };

    BrowserNotificationsService.dispatch('New Commits Found', message, onClickcallback);
  }
}

export default BrowserNotificationsService;
