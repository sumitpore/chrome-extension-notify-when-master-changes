import { getObjectFromLocalStorage, saveObjectInLocalStorage, removeObjectFromLocalStorage } from './local-storage-api';

const saveRepoInfoInStorage = async function(repoIdentifier, repoInfo) {
  let savedRepos = await getObjectFromLocalStorage('repos');
  let repos = null;
  let repoInfoToSave = null;
  if (typeof savedRepos == 'undefined') {
    let newRepo = { [repoIdentifier]: repoInfo };
    repos = { ...newRepo };
  } else {
    if (typeof savedRepos[repoIdentifier] == 'undefined') {
      repoInfoToSave = { [repoIdentifier]: repoInfo };
    } else {
      let updateInfo = { ...savedRepos[repoIdentifier], ...repoInfo };
      repoInfoToSave = { [repoIdentifier]: updateInfo };
    }
    repos = { ...savedRepos, ...repoInfoToSave };
  }
  await saveObjectInLocalStorage({ repos });
};

const removeMultipleRepoInfoFromStorage = async function(repoIdentifiers = []) {
  if (repoIdentifiers.length == 0) {
    return;
  }

  let savedRepos = await getObjectFromLocalStorage('repos');
  if (typeof savedRepos == 'undefined') return;

  for (let repoIdentifier of repoIdentifiers) {
    if (typeof savedRepos[repoIdentifier] == 'undefined') continue;
    delete savedRepos[repoIdentifier];
  }

  await saveObjectInLocalStorage({ repos: savedRepos });
};

const removeRepoInfoFromStorage = async function(repoIdentifier) {
  let savedRepos = await getObjectFromLocalStorage('repos');
  if (typeof savedRepos == 'undefined') return;
  if (typeof savedRepos[repoIdentifier] == 'undefined') return;
  delete savedRepos[repoIdentifier];
  await saveObjectInLocalStorage({ repos: savedRepos });
};

const getRepoInfoFromStorage = async function(repoIdentifier) {
  let savedRepos = await getObjectFromLocalStorage('repos');
  if (typeof savedRepos == 'undefined') return null;
  return typeof savedRepos[repoIdentifier] == 'undefined' ? null : savedRepos[repoIdentifier];
};

const isRepoStoredInStorage = async function(repoIdentifier) {
  let result = await getRepoInfoFromStorage(repoIdentifier);
  return result == null ? false : true;
};

const getAllReposFromStorage = async function() {
  let savedRepos = await getObjectFromLocalStorage('repos');
  if (typeof savedRepos == 'undefined') return null;
  return savedRepos;
};

const getAllSavedReposIdentifiers = async function() {
  let savedRepos = await getAllReposFromStorage();
  if (savedRepos == null) return [];
  return Object.keys(savedRepos);
};

export {
  saveRepoInfoInStorage,
  removeMultipleRepoInfoFromStorage,
  removeRepoInfoFromStorage,
  isRepoStoredInStorage,
  getAllReposFromStorage,
  getRepoInfoFromStorage,
  getAllSavedReposIdentifiers,
};
