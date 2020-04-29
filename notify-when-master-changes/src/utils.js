const isValidRepoUrl = function(url) {
  if (!url || url.length === 0) {
    return false;
  }

  if (!url.startsWith('https://github.com/')) {
    return false;
  }

  url = url.replace('https://github.com/', '');

  if (url.length === 0) {
    return false;
  }

  let urlSegments = url.split('/');

  // urlSegments should have at least 2 segments
  if (urlSegments[1] == null) {
    return false;
  }

  return true;
};

const getRepoIdentifierFromUrl = function(url) {
  if (!isValidRepoUrl(url)) {
    return null;
  }
  url = url.replace('https://github.com/', '');
  let urlSegments = url.split('/');
  return urlSegments[0] + '/' + urlSegments[1];
};

/**
 * Retrieve object from Chrome's Local StorageArea
 * @param {string} key
 */
const getObjectFromLocalStorage = async function(key) {
  return new Promise((resolve, reject) => {
    try {
      chrome.storage.local.get(key, function(value) {
        resolve(value[key]);
      });
    } catch (ex) {
      reject(ex);
    }
  });
};

/**
 * Save Object in Chrome's Local StorageArea
 * @param {*} obj
 */
const saveObjectInLocalStorage = async function(obj) {
  return new Promise((resolve, reject) => {
    try {
      chrome.storage.local.set(obj, function() {
        resolve();
      });
    } catch (ex) {
      reject(ex);
    }
  });
};

/**
 * Removes Object from Chrome Local StorageArea.
 *
 * @param {string or array of string keys} keys
 */
const removeObjectFromLocalStorage = async function(keys) {
  return new Promise((resolve, reject) => {
    try {
      chrome.storage.local.remove(keys, function() {
        resolve();
      });
    } catch (ex) {
      reject(ex);
    }
  });
};

const saveRepoInfoInStorage = async function(repoIdentifier, repoInfo) {
  await saveObjectInLocalStorage({
    [repoIdentifier]: repoInfo,
  });
};

const removeRepoInfoFromStorage = async function(repoIdentifier) {
  await removeObjectFromLocalStorage(repoIdentifier);
};

const isRepoStoredInStorage = async function(repoIdentifier) {
  let result = await getObjectFromLocalStorage(repoIdentifier);
  return typeof result == 'undefined' ? false : true;
};

export { getRepoIdentifierFromUrl, isRepoStoredInStorage, saveRepoInfoInStorage, removeRepoInfoFromStorage };
