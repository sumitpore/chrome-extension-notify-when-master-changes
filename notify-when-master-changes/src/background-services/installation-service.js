import autoBind from 'auto-bind';
import FetchCommitsService from './fetch-commits-service';

class InstallationService {
  props = {
    alarmPeriodsInMinutes: {
      fetchCommitsPeriod: 120, // schedule a new fetch every 2 Hours
      watchdogPeriod: 5, // schedule a watchdog check every 5 minutes
    },
  };

  constructor() {
    autoBind(this);
    this.addListeners();
  }

  addListeners() {
    chrome.runtime.onInstalled.addListener(this.onExtensionInstalled);
    chrome.runtime.onStartup.addListener(this.onBrowserStart);
    chrome.alarms.onAlarm.addListener(this.onAlarm);
  }

  onExtensionInstalled() {
    // create alarm for watchdog and fresh on installed/updated, and start fetch data
    this.scheduleRequest();
    this.scheduleWatchdog();
    FetchCommitsService.fetchCommits();
  }

  onBrowserStart() {
    // fetch and save data when chrome restarted, alarm will continue running when chrome is restarted
    console.log('onStartup....');
    FetchCommitsService.fetchCommits();
  }

  onAlarm(alarm) {
    // if watchdog is triggered, check whether refresh alarm is there
    if (alarm && alarm.name === 'watchdog') {
      chrome.alarms.get('refresh', alarm => {
        if (alarm) {
          console.log('Refresh alarm exists. Yay.');
        } else {
          // if it is not there, start a new request and reschedule refresh alarm
          console.log("Refresh alarm doesn't exist, starting a new one");
          FetchCommitsService.fetchCommits();
          this.scheduleRequest();
        }
      });
    } else {
      // if refresh alarm triggered, start a new request
      FetchCommitsService.fetchCommits();
    }
  }

  scheduleRequest() {
    console.log(`schedule refresh alarm to ${this.props.alarmPeriodsInMinutes.fetchCommitsPeriod} minutes...`);
    chrome.alarms.create('refresh', { periodInMinutes: this.props.alarmPeriodsInMinutes.fetchCommitsPeriod });
  }

  scheduleWatchdog() {
    console.log(`schedule watchdog alarm to ${this.props.alarmPeriodsInMinutes.watchdogPeriod} minutes...`);
    chrome.alarms.create('watchdog', { periodInMinutes: this.props.alarmPeriodsInMinutes.watchdogPeriod });
  }
}

export default InstallationService;
