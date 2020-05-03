import { getRepoInfoFromStorage, getAllReposFromStorage, saveRepoInfoInStorage } from './repo-info-storage-api';
import { getObjectFromLocalStorage, saveObjectInLocalStorage } from './local-storage-api';

const getRepoNotifications = async function(repoIdentifier) {
  let repoInfo = await getRepoInfoFromStorage(repoIdentifier);
  if (repoInfo == null) return null;
  return typeof repoInfo['notifications'] == 'undefined' || repoInfo['notifications'] == null ? [] : repoInfo['notifications'];
};

// example notification object { sha: '175aefa0b85ed9a740636f816495479e5787ed9d',
// message: 'Commit Message' }
const saveNotification = async function(repoIdentifier, notification) {
  let notifications = await getRepoNotifications(repoIdentifier);
  notifications = { ...notifications, notification };
  saveRepoInfoInStorage(repoIdentifier, { notifications });
};

const removeAllNotificationsOfRepo = async function(repoIdentifier) {
  saveRepoInfoInStorage(repoIdentifier, { notifications: {} });
};

const removeSingleNotificationOfRepo = async function(repoIdentifier, commitSha) {
  let notifications = await getRepoNotifications(repoIdentifier);
  if (notifications.length == 0) return;
  for (let notification of notifications) {
    if (notification.sha == commitSha) {
      delete notification.sha;
    }
  }
  saveRepoInfoInStorage(repoIdentifier, { notifications });
};

const getAllReposNotifications = async function() {
  let allRepos = await getAllReposFromStorage();
  let notifications = {};
  if (allRepos == null) return notifications;
  for (let repoIdentifier in allRepos) {
    if (typeof allRepos[repoIdentifier]['notifications'] == 'undefined' || allRepos[repoIdentifier]['notifications'] == null) {
      continue;
    }
    let notification = { [repoIdentifier]: allRepos[repoIdentifier]['notifications'] };
    notifications = { ...notifications, notification };
  }
  return notifications;
};

const getTotalNumberOfPendingNotifications = async function() {
  let numberOfPendingNotifications = await getObjectFromLocalStorage('pending_notifications_count');
  if (typeof numberOfPendingNotifications == 'undefined') return 0;
  return numberOfPendingNotifications;
};

const increamentNumberOfPendingNotifications = async function() {
  let numberOfPendingNotifications = parseInt(await getTotalNumberOfPendingNotifications());
  saveObjectInLocalStorage({ pending_notifications_count: numberOfPendingNotifications + 1 });
};

const decrementNumberOfPendingNotifications = async function() {
  let numberOfPendingNotifications = parseInt(await getTotalNumberOfPendingNotifications());
  if (numberOfPendingNotifications > 0) {
    saveObjectInLocalStorage({ pending_notifications_count: numberOfPendingNotifications - 1 });
  }
};

export {
  getRepoNotifications,
  saveNotification,
  removeAllNotificationsOfRepo,
  removeSingleNotificationOfRepo,
  getAllReposNotifications,
  getTotalNumberOfPendingNotifications,
  increamentNumberOfPendingNotifications,
  decrementNumberOfPendingNotifications,
};
