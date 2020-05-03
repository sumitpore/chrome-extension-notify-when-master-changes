import { getAllSavedReposIdentifiers } from './data-layer/repo-info-storage-api';
import { getLastFetchedCommitSha, saveLastFetchedCommitSha } from './data-layer/last-fetched-commit-sha-storage-api';
import { saveNotification } from './data-layer/notifications-storage-api';

chrome.browserAction.setPopup({ popup: '' }); //disable browserAction's popup

chrome.browserAction.onClicked.addListener(() => {
  chrome.tabs.create({ url: 'options/options.html' });
});

// create alarm for watchdog and fresh on installed/updated, and start fetch data
chrome.runtime.onInstalled.addListener(() => {
  console.log('onInstalled....');
  scheduleRequest();
  scheduleWatchdog();
  fetchCommits();
});

// fetch and save data when chrome restarted, alarm will continue running when chrome is restarted
chrome.runtime.onStartup.addListener(() => {
  console.log('onStartup....');
  fetchCommits();
});

// alarm listener
chrome.alarms.onAlarm.addListener(alarm => {
  // if watchdog is triggered, check whether refresh alarm is there
  if (alarm && alarm.name === 'watchdog') {
    chrome.alarms.get('refresh', alarm => {
      if (alarm) {
        console.log('Refresh alarm exists. Yay.');
      } else {
        // if it is not there, start a new request and reschedule refresh alarm
        console.log("Refresh alarm doesn't exist, starting a new one");
        fetchCommits();
        scheduleRequest();
      }
    });
  } else {
    // if refresh alarm triggered, start a new request
    fetchCommits();
  }
});

// schedule a new fetch every 30 minutes
function scheduleRequest() {
  console.log('schedule refresh alarm to 3 minutes...');
  chrome.alarms.create('refresh', { periodInMinutes: 3 });
}

// schedule a watchdog check every 5 minutes
function scheduleWatchdog() {
  console.log('schedule watchdog alarm to 5 minutes...');
  chrome.alarms.create('watchdog', { periodInMinutes: 5 });
}

// fetch data and save to local storage
async function fetchCommits() {
  console.log('start HTTP Request...');
  let repoIdentifiers = await getAllSavedReposIdentifiers();
  if (!repoIdentifiers.length == 0) {
    return;
  }

  for (repoIdentifier of repoIdentifiers) {
    let lastFetchedCommitSha = getLastFetchedCommitSha(repoIdentifier);
    let response = fetch(`https://api.github.com/repos/${lastFetchedCommitSha}/commits/master`);
    if (response.ok) {
      let json = await response.json();
      if (json.sha == lastFetchedCommitSha) {
        continue;
      }
      console.log(json);
      saveNotification(repoIdentifier, { sha: json.sha, message: json.commit.message });
      saveLastFetchedCommitSha(repoIdentifier, json.sha);
    } else {
      console.log('HTTP-Error: ' + response.status);
    }
  }
}
