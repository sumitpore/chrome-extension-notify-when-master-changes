import { getAllSavedReposIdentifiers } from '../data-layer/repo-info-storage-api';
import { getLastFetchedCommitSha, saveLastFetchedCommitSha } from '../data-layer/last-fetched-commit-sha-storage-api';
import { saveNotification, increamentNumberOfPendingNotifications } from '../data-layer/notifications-storage-api';

class FetchCommitsService {
  // fetch data and save to local storage
  static async fetchCommits() {
    console.log('start HTTP Request...');
    let repoIdentifiers = await getAllSavedReposIdentifiers();
    console.log(repoIdentifiers);

    if (repoIdentifiers.length == 0) {
      return;
    }

    for (let repoIdentifier of repoIdentifiers) {
      let lastFetchedCommitSha = await getLastFetchedCommitSha(repoIdentifier);
      let response = await fetch(`https://api.github.com/repos/${repoIdentifier}/commits/master`);
      if (response.ok) {
        let json = await response.json();
        if (json.sha == lastFetchedCommitSha) {
          continue;
        }
        console.log(json);
        // without await only one of the below data makes it to local storage.
        await saveNotification(repoIdentifier, { sha: json.sha, message: json.commit.message });
        await saveLastFetchedCommitSha(repoIdentifier, json.sha);
        await increamentNumberOfPendingNotifications();
      } else {
        console.log('HTTP-Error: ' + response.status);
      }
    }
  }
}

export default FetchCommitsService;
