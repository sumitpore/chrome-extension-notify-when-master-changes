/* eslint-disable no-continue */
import { getRepoInfoFromStorage, getAllReposFromStorage, saveRepoInfoInStorage } from './repo-info-storage-api';
import { getObjectFromLocalStorage, saveObjectInLocalStorage } from './local-storage-api';

const getRepoNotifications = async function(repoIdentifier) {
  const repoInfo = await getRepoInfoFromStorage(repoIdentifier);
  if (repoInfo == null) return null;
  return typeof repoInfo.notifications === 'undefined' || repoInfo.notifications == null ? [] : repoInfo.notifications;
};

const getPendingNotificationsCountOfRepo = async function(repoIdentifier) {
  const repoInfo = await getRepoInfoFromStorage(repoIdentifier);
  if (repoInfo == null) return 0;
  return typeof repoInfo.notifications === 'undefined' || repoInfo.notifications == null ? 0 : repoInfo.notifications.length;
};

// example notification object { sha: '175aefa0b85ed9a740636f816495479e5787ed9d',
// message: 'Commit Message' }
const saveNotification = async function(repoIdentifier, notification) {
  const notifications = await getRepoNotifications(repoIdentifier);
  notifications.push(notification);
  await saveRepoInfoInStorage(repoIdentifier, { notifications });
};

const deleteAllNotificationsOfRepo = async function(repoIdentifier) {
  saveRepoInfoInStorage(repoIdentifier, { notifications: [] });
};

const deleteSingleNotificationOfRepo = async function(repoIdentifier, commitSha) {
  const notifications = await getRepoNotifications(repoIdentifier);
  if (notifications.length == 0) return;
  Object.keys(notifications).forEach(index => {
    if (typeof notifications[index] == 'undefined') return;
    if (notifications[index].sha == commitSha) {
      notifications.splice(index, 1);
    }
  });

  saveRepoInfoInStorage(repoIdentifier, { notifications });
};

const getAllReposNotifications = async function() {
  const allRepos = await getAllReposFromStorage();
  let notifications = {};
  if (allRepos == null) return notifications;

  Object.keys(allRepos).forEach(repoIdentifier => {
    if (typeof allRepos[repoIdentifier].notifications === 'undefined' || allRepos[repoIdentifier].notifications == null || allRepos[repoIdentifier].notifications.length == 0) {
      return;
    }
    const notification = { [repoIdentifier]: allRepos[repoIdentifier].notifications };
    notifications = { ...notifications, ...notification };
  });
  return notifications;
};

const getTotalNumberOfPendingNotifications = async function() {
  const numberOfPendingNotifications = await getObjectFromLocalStorage('pending_notifications_count');
  if (typeof numberOfPendingNotifications === 'undefined') return 0;
  return numberOfPendingNotifications;
};

const updatePendingNotificationsCount = async function(notificationsCount) {
  saveObjectInLocalStorage({ pending_notifications_count: parseInt(notificationsCount, 10) });

  const ba = chrome.browserAction;
  if (notificationsCount > 0) {
    ba.setBadgeBackgroundColor({ color: [255, 0, 0, 128] });
    ba.setBadgeText({ text: `${notificationsCount}` });
  } else {
    ba.setBadgeText({ text: '' });
  }
};

const increamentNumberOfPendingNotifications = async function() {
  const numberOfPendingNotifications = parseInt(await getTotalNumberOfPendingNotifications(), 10);
  updatePendingNotificationsCount(numberOfPendingNotifications + 1);
};

export {
  getRepoNotifications,
  getPendingNotificationsCountOfRepo,
  saveNotification,
  deleteAllNotificationsOfRepo,
  deleteSingleNotificationOfRepo,
  getAllReposNotifications,
  getTotalNumberOfPendingNotifications,
  updatePendingNotificationsCount,
  increamentNumberOfPendingNotifications,
};
