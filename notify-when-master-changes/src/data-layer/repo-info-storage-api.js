import { getObjectFromLocalStorage, saveObjectInLocalStorage, removeObjectFromLocalStorage } from './local-storage-api';

const saveRepoInfoInStorage = async function(repoIdentifier, repoInfo) {
  let savedRepos = await getObjectFromLocalStorage('repos');
  let newRepo = { [repoIdentifier]: repoInfo };
  let repos = null;
  if (typeof savedRepos == 'undefined') {
    repos = { ...newRepo };
  } else {
    repos = { ...savedRepos, ...newRepo };
  }
  await saveObjectInLocalStorage({ repos });
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

export { saveRepoInfoInStorage, removeRepoInfoFromStorage, isRepoStoredInStorage };
