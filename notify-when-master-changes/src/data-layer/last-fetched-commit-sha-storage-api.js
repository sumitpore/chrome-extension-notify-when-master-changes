import { getRepoInfoFromStorage, saveRepoInfoInStorage } from './repo-info-storage-api';

// eslint-disable-next-line consistent-return
const saveLastFetchedCommitSha = async function(repoIdentifier, commitSha) {
  const repoInfo = await getRepoInfoFromStorage(repoIdentifier);
  if (repoInfo == null) return null;
  saveRepoInfoInStorage(repoIdentifier, { last_fetched_commit_sha: commitSha });
};

const getLastFetchedCommitSha = async function(repoIdentifier) {
  const repoInfo = await getRepoInfoFromStorage(repoIdentifier);
  if (repoInfo == null) return null;
  return typeof repoInfo.last_fetched_commit_sha == 'undefined' || repoInfo.last_fetched_commit_sha == null ? null : repoInfo.last_fetched_commit_sha;
};

export { saveLastFetchedCommitSha, getLastFetchedCommitSha };
