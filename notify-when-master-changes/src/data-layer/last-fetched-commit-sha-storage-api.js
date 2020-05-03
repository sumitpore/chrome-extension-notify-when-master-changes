import { getRepoInfoFromStorage, saveRepoInfoInStorage } from './repo-info-storage-api';

const saveLastFetchedCommitSha = async function(repoIdentifier, commitSha) {
  let repoInfo = await getRepoInfoFromStorage(repoIdentifier);
  if (repoInfo == null) return null;
  saveRepoInfoInStorage(repoIdentifier, { last_fetched_commit_sha: commitSha });
};

const getLastFetchedCommitSha = async function(repoIdentifier) {
  let repoInfo = await getRepoInfoFromStorage(repoIdentifier);
  if (repoInfo == null) return null;
  return typeof repoInfo['last_fetched_commit_sha'] == 'undefined' || repoInfo['last_fetched_commit_sha'] == null ? null : repoInfo['last_fetched_commit_sha'];
};

export { saveLastFetchedCommitSha, getLastFetchedCommitSha };
