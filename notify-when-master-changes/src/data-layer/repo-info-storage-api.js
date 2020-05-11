import { getObjectFromLocalStorage, saveObjectInLocalStorage } from './local-storage-api';

const saveRepoInfoInStorage = async function(repoIdentifier, repoInfo) {
  const savedRepos = await getObjectFromLocalStorage('repos');
  let repos = null;
  let repoInfoToSave = null;
  if (typeof savedRepos == 'undefined') {
    const newRepo = { [repoIdentifier]: repoInfo };
    repos = { ...newRepo };
  } else {
    if (typeof savedRepos[repoIdentifier] == 'undefined') {
      repoInfoToSave = { [repoIdentifier]: repoInfo };
    } else {
      const updateInfo = { ...savedRepos[repoIdentifier], ...repoInfo };
      repoInfoToSave = { [repoIdentifier]: updateInfo };
    }
    repos = { ...savedRepos, ...repoInfoToSave };
  }
  await saveObjectInLocalStorage({ repos });
};

const deleteMultipleRepoInfoFromStorage = async function(repoIdentifiers = []) {
  if (repoIdentifiers.length == 0) {
    return;
  }

  const savedRepos = await getObjectFromLocalStorage('repos');
  if (typeof savedRepos == 'undefined') return;

  repoIdentifiers.forEach(repoIdentifier => {
    if (typeof savedRepos[repoIdentifier] == 'undefined') return;
    delete savedRepos[repoIdentifier];
  });

  await saveObjectInLocalStorage({ repos: savedRepos });
};

const deleteRepoInfoFromStorage = async function(repoIdentifier) {
  const savedRepos = await getObjectFromLocalStorage('repos');
  if (typeof savedRepos == 'undefined') return;
  if (typeof savedRepos[repoIdentifier] == 'undefined') return;
  delete savedRepos[repoIdentifier];
  await saveObjectInLocalStorage({ repos: savedRepos });
};

const getRepoInfoFromStorage = async function(repoIdentifier) {
  const savedRepos = await getObjectFromLocalStorage('repos');
  if (typeof savedRepos == 'undefined') return null;
  return typeof savedRepos[repoIdentifier] == 'undefined' ? null : savedRepos[repoIdentifier];
};

const isRepoStoredInStorage = async function(repoIdentifier) {
  const result = await getRepoInfoFromStorage(repoIdentifier);
  return result != null;
};

const getAllReposFromStorage = async function() {
  const savedRepos = await getObjectFromLocalStorage('repos');
  if (typeof savedRepos == 'undefined') return null;
  return savedRepos;
};

const getAllSavedReposIdentifiers = async function() {
  const savedRepos = await getAllReposFromStorage();
  if (savedRepos == null) return [];
  return Object.keys(savedRepos);
};

export {
  saveRepoInfoInStorage,
  deleteMultipleRepoInfoFromStorage,
  deleteRepoInfoFromStorage,
  isRepoStoredInStorage,
  getAllReposFromStorage,
  getRepoInfoFromStorage,
  getAllSavedReposIdentifiers,
};
