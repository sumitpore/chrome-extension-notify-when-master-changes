/* eslint-disable no-restricted-syntax */
/* eslint-disable no-continue */
/* eslint-disable no-await-in-loop */
import { getAllReposIdentifiersFromStorage } from '../data-layer/repo-info-storage-api';
import { getLastFetchedCommitSha, saveLastFetchedCommitSha } from '../data-layer/last-fetched-commit-sha-storage-api';
import { saveNotification, increamentNumberOfPendingNotifications } from '../data-layer/notifications-storage-api';
import BrowserNotificationsService from './browser-notifications-service';

class FetchCommitsService {
  // fetch data and save to local storage
  static async fetchCommits() {
    const repoIdentifiers = await getAllReposIdentifiersFromStorage();
    const browserNotificationRepos = [];

    if (repoIdentifiers.length == 0) {
      return;
    }

    for (const repoIdentifier of repoIdentifiers) {
      const lastFetchedCommitSha = await getLastFetchedCommitSha(repoIdentifier);
      const latestCommitOnMaster = await FetchCommitsService.FetchLatestCommitOnMaster(repoIdentifier);
      console.log(`Last Fetched Commit SHA and Latest Commit On Master For ${repoIdentifier}`, {
        lastFetchedCommitSha,
        latestCommitOnMaster,
      });
      if (latestCommitOnMaster == null) {
        continue;
      }

      // No new changes in repo.
      if (latestCommitOnMaster.sha == lastFetchedCommitSha) {
        continue;
      }

      // We fetched commit for the first time for a repo
      if (lastFetchedCommitSha == null) {
        await FetchCommitsService.saveCommitInStorage(repoIdentifier, latestCommitOnMaster);
        await saveLastFetchedCommitSha(repoIdentifier, latestCommitOnMaster.sha);
        browserNotificationRepos.push(repoIdentifier);
        continue;
      }

      const commitsBetweenLastFetchedAndLatestMaster = await FetchCommitsService.FetchAllCommitsBetweenTwoCommits(repoIdentifier, lastFetchedCommitSha, latestCommitOnMaster.sha);

      console.log(`All Commits between Master and Last Fetched SHA For ${repoIdentifier}`, commitsBetweenLastFetchedAndLatestMaster);

      // If fetching all commits fails, save data we got from master commit fetch.
      if (commitsBetweenLastFetchedAndLatestMaster == null) {
        await FetchCommitsService.saveCommitInStorage(repoIdentifier, latestCommitOnMaster);
        await saveLastFetchedCommitSha(repoIdentifier, latestCommitOnMaster.sha);
        browserNotificationRepos.push(repoIdentifier);
        continue;
      }

      // Save all commits
      for (const commit of commitsBetweenLastFetchedAndLatestMaster.commits) {
        await FetchCommitsService.saveCommitInStorage(repoIdentifier, commit);
      }
      await saveLastFetchedCommitSha(repoIdentifier, latestCommitOnMaster.sha);
      browserNotificationRepos.push(repoIdentifier);
    }

    if (browserNotificationRepos.length) {
      console.log('Dispatching Browser Notification!');
      BrowserNotificationsService.dispatchNewCommitsNotification(browserNotificationRepos);
    }
  }

  static async FetchLatestCommitOnMaster(repoIdentifier) {
    const response = await fetch(`https://api.github.com/repos/${repoIdentifier}/commits/master`);
    if (response.ok) {
      return response.json();
    }
    console.log(`HTTP-Error: ${response.status}`);
    return null;
  }

  static async FetchAllCommitsBetweenTwoCommits(repoIdentifier, startCommit, endCommit) {
    const response = await fetch(`https://api.github.com/repos/${repoIdentifier}/compare/${startCommit}...${endCommit}`);
    if (response.ok) {
      return response.json();
    }
    console.log(`HTTP-Error: ${response.status}`);
    return null;
  }

  static async saveCommitInStorage(repoIdentifier, commit) {
    // without await only one of the below data makes it to local storage.
    await saveNotification(repoIdentifier, { sha: commit.sha, message: commit.commit.message });
    await increamentNumberOfPendingNotifications();
  }
}

export default FetchCommitsService;
