<template>
  <div class="container">
    <h1>
      Notifications
      <span class="notifications-count" v-if="pendingNotificationsCount > 0">{{ pendingNotificationsCount }}</span>
    </h1>
    <section v-if="pendingNotificationsCount > 0">
      <div v-for="(commits, repoIdentifier) in notifications" :key="repoIdentifier" class="repo-item">
        <div class="repo-title">
          <input type="checkbox" v-model="selectedRepos" :value="repoIdentifier" />
          <a :href="getRepoUrlFromIdentifier(repoIdentifier)" target="_blank">{{ repoIdentifier }}</a>
        </div>

        <div class="commits-wrapper">
          <button
            v-if="commits.length > minCommitsCountForCarousel"
            class="left-arrow-icon"
            :id="`${repoIdentifier}-previous-commits-icon`"
            @click="showPreviousCommits(repoIdentifier)"
          ></button>
          <div class="commits" :id="`${repoIdentifier}-commits`">
            <a
              target="_blank"
              v-for="(commit, index) in commits"
              :key="commit.sha"
              :title="commit.message"
              :href="`https://github.com/${repoIdentifier}/commit/${commit.sha}`"
              @click="markNotificationRead(repoIdentifier, commit.sha, index)"
              >{{ commit.sha.substring(0, 7) }}</a
            >
          </div>
          <button
            v-if="commits.length > minCommitsCountForCarousel"
            class="right-arrow-icon"
            :id="`${repoIdentifier}-next-commits-icon`"
            @click="showNextCommits(repoIdentifier)"
          ></button>
        </div>

        <div class="action-items">
          <button class="mute-icon" title="Unsubscribe" @click="unsubscribeRepoExtended(repoIdentifier)"></button>
        </div>
      </div>

      <button class="primary-btn" :disabled="selectedRepos.length == 0" @click="deleteSelectedReposNotifications">Delete Notifications</button>
    </section>

    <section v-else>
      <div class="repo-item no-items">Everything Caught Up!</div>
    </section>
  </div>
</template>

<script>
import mixin from '../../shared/vue-mixins';
import {
  getAllReposNotifications,
  getTotalNumberOfPendingNotifications,
  decrementNumberOfPendingNotifications,
  updateNumberOfPendingNotifications,
  deleteAllNotificationsOfRepo,
  deleteSingleNotificationOfRepo,
} from '../../data-layer/notifications-storage-api';

export default {
  name: 'NotificationsList',

  mixins: [mixin],

  data: function() {
    return {
      minCommitsCountForCarousel: 3,
      singleCommitElementWidth: 0,
    };
  },

  mounted: async function() {
    if (this.pendingNotificationsCount <= 0) {
      return;
    }

    await this.$nextTick();

    let singleCommitElement = document.querySelector('.commits a:first-of-type');
    if (singleCommitElement != null) {
      this.singleCommitElementWidth = singleCommitElement.clientWidth;
    }

    this.controlVisibilityPreviousAndNextIcons();
  },

  asyncComputed: {
    notifications: {
      async get() {
        return await getAllReposNotifications();
      },
      default: {},
    },
    pendingNotificationsCount: {
      async get() {
        return await getTotalNumberOfPendingNotifications();
      },
      default: 0,
    },
  },

  methods: {
    showPreviousCommits: function(repoIdentifier) {
      let commitsElement = document.getElementById(`${repoIdentifier}-commits`);
      commitsElement.scrollLeft = commitsElement.scrollLeft - commitsElement.offsetWidth + this.singleCommitElementWidth;
    },

    showNextCommits: function(repoIdentifier) {
      let commitsElement = document.getElementById(`${repoIdentifier}-commits`);
      commitsElement.scrollLeft = commitsElement.scrollLeft + commitsElement.offsetWidth - this.singleCommitElementWidth;
    },

    controlVisibilityPreviousAndNextIcons: function() {
      let allCommitsElements = document.querySelectorAll('.commits');
      if (allCommitsElements == null) return;
      for (let commitsElement of allCommitsElements) {
        if (commitsElement.childElementCount <= this.minCommitsCountForCarousel) return;
        let commitsWrapper = commitsElement.closest('.commits-wrapper');
        this.addObserverOnFirstCommitVisibilityOfRepo(commitsElement, commitsWrapper);
        this.addObserverOnLastCommitVisibilityOfRepo(commitsElement, commitsWrapper);
      }
    },

    addObserverOnFirstCommitVisibilityOfRepo: function(commitsElement, commitsWrapper) {
      let previousCommitsIconElement = commitsWrapper.querySelector('.left-arrow-icon');
      let firstCommitElement = commitsElement.querySelector('a:first-of-type');
      let firstCommitObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              previousCommitsIconElement.hidden = true;
            } else {
              previousCommitsIconElement.hidden = false;
            }
          });
        },
        {
          root: commitsElement,
          rootMargin: '0px 0px 0px 10px',
          threshold: 1.0,
        }
      );
      firstCommitObserver.observe(firstCommitElement);
    },

    addObserverOnLastCommitVisibilityOfRepo: function(commitsElement, commitsWrapper) {
      let nextCommitsIconElement = commitsWrapper.querySelector('.right-arrow-icon');
      let lastCommitElement = commitsElement.querySelector('a:last-of-type');
      let lastCommitObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              nextCommitsIconElement.hidden = true;
            } else {
              nextCommitsIconElement.hidden = false;
            }
          });
        },
        {
          root: commitsElement,
          rootMargin: '0px 10px 0px 0px',
          threshold: 1.0,
        }
      );
      lastCommitObserver.observe(lastCommitElement);
    },

    markNotificationRead: async function(repoIdentifier, commitSha, index) {
      this.$delete(this.notifications[repoIdentifier], index);
      deleteSingleNotificationOfRepo(repoIdentifier, commitSha);

      this.pendingNotificationsCount = this.pendingNotificationsCount - 1;
      decrementNumberOfPendingNotifications();
    },

    unsubscribeRepoExtended: function(repoIdentifier) {
      let repoPendingNotificationsCount = this.notifications[repoIdentifier].length;
      this.pendingNotificationsCount = this.pendingNotificationsCount - repoPendingNotificationsCount;
      this.$delete(this.notifications, repoIdentifier);

      this.unsubscribeRepo(repoIdentifier);
      updateNumberOfPendingNotifications(this.pendingNotificationsCount);
    },

    deleteSelectedReposNotifications: async function() {
      for (let repoIdentifier of this.selectedRepos) {
        await deleteAllNotificationsOfRepo(repoIdentifier);
        let repoPendingNotificationsCount = this.notifications[repoIdentifier].length;
        this.pendingNotificationsCount = this.pendingNotificationsCount - repoPendingNotificationsCount;
        await updateNumberOfPendingNotifications(this.pendingNotificationsCount);
        this.$delete(this.notifications, repoIdentifier);
      }

      this.selectedRepos = [];
    },
  },
};
</script>

<style lang="scss" scoped>
.notifications-count {
  background: var(--primary-heading-color);
  width: 40px;
  height: 40px;
  display: inline-block;
  color: white;
  border-radius: 50%;
  vertical-align: middle;
  text-align: center;
  line-height: 40px;
  font-size: 18px;
}

.repo-title {
  width: 55%;
  display: flex;
  word-wrap: break-word;

  a {
    width: 90%;
  }
}

.action-items {
  width: 12%;
  text-align: right;
  margin-right: 30px;

  a {
    margin-right: 8px;
    text-decoration: none;
    color: var(--primary-color);
    vertical-align: middle;
  }
}

.commits-wrapper {
  width: 33%;
  display: flex;
  align-items: center;
}

.commits {
  overflow-x: scroll;
  white-space: nowrap;
  border-radius: 3px;
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.25);
  margin-left: 20px;
  margin-right: 20px;
  scroll-behavior: smooth;

  &::-webkit-scrollbar {
    width: 0;
    height: 0;
    background: transparent;
  }

  a {
    padding: 5px;
    text-decoration: none;
    color: var(--primary-color);
    background: white;
    display: inline-block;
    border-right: 1px solid var(--primary-border-color);
    font-size: 16px;
    &:hover {
      background: var(--primary-color);
      color: white;
    }

    &:last-of-type {
      border-right: 0;
    }
  }
}
</style>
