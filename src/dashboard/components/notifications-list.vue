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
            @click="ui.showPreviousCommits(repoIdentifier)"
          ></button>
          <div class="commits" :id="`${repoIdentifier}-commits`">
            <a
              target="_blank"
              v-for="(commit, index) in commits"
              :key="commit.sha"
              :title="commit.message"
              :href="`https://github.com/${repoIdentifier}/commit/${commit.sha}`"
              @click="uiStorage.deleteCommit(repoIdentifier, commit.sha, index)"
              >{{ commit.sha.substring(0, 7) }}</a
            >
          </div>
          <button
            v-if="commits.length > minCommitsCountForCarousel"
            class="right-arrow-icon"
            :id="`${repoIdentifier}-next-commits-icon`"
            @click="ui.showNextCommits(repoIdentifier)"
          ></button>
        </div>

        <div class="action-items">
          <button class="mute-icon" title="Unsubscribe" @click="uiStorage.unsubscribeRepo(repoIdentifier)"></button>
        </div>
      </div>

      <button class="primary-btn" :disabled="selectedRepos.length == 0" @click="uiStorage.deleteSelectedReposNotifications">Delete Notifications</button>
    </section>

    <section v-else>
      <div class="repo-item no-items">Everything Caught Up!</div>
    </section>
  </div>
</template>

<script>
import { getRepoUrlFromIdentifier } from '../../utils';
import * as notificationsStorage from '../../data-layer/notifications-storage-api';
import { deleteRepoInfoFromStorage } from '../../data-layer/repo-info-storage-api';

export default {
  name: 'NotificationsList',

  data() {
    return {
      minCommitsCountForCarousel: 3,
      singleCommitElementWidth: 0,
      selectedRepos: [],
      notifications: {},
      pendingNotificationsCount: 0,
      ui: this.uiMethods(),
      storage: this.storageMethods(),
      uiStorage: this.uiStorageMethods(),
    };
  },

  async mounted() {
    this.$root.$on('rerender-notifications-list-screen', async () => {
      this.notifications = await this.storage.getAllReposNotifications();
      this.pendingNotificationsCount = await this.storage.getTotalNumberOfPendingNotifications();
      this.selectedRepos = [];
    });

    this.notifications = await this.storage.getAllReposNotifications();
    this.pendingNotificationsCount = await this.storage.getTotalNumberOfPendingNotifications();

    if (this.pendingNotificationsCount <= 0) {
      return;
    }

    await this.$nextTick();

    const singleCommitElement = document.querySelector('.commits a:first-of-type');
    if (singleCommitElement != null) {
      this.singleCommitElementWidth = singleCommitElement.clientWidth;
    }

    this.ui.controlVisibilityPreviousAndNextIcons();
  },

  methods: {
    getRepoUrlFromIdentifier,
    // Methods that affect UI. Access inside methods with `this.ui`
    uiMethods() {
      return {
        showPreviousCommits(repoIdentifier) {
          const commitsElement = document.getElementById(`${repoIdentifier}-commits`);
          commitsElement.scrollLeft = commitsElement.scrollLeft - commitsElement.offsetWidth + this.singleCommitElementWidth;
        },

        showNextCommits: repoIdentifier => {
          const commitsElement = document.getElementById(`${repoIdentifier}-commits`);
          commitsElement.scrollLeft = commitsElement.scrollLeft + commitsElement.offsetWidth - this.singleCommitElementWidth;
        },

        controlVisibilityPreviousAndNextIcons: () => {
          const allCommitsElements = document.querySelectorAll('.commits');
          if (allCommitsElements == null) return;
          allCommitsElements.forEach(commitsElement => {
            if (commitsElement.childElementCount <= this.minCommitsCountForCarousel) return;
            const commitsWrapper = commitsElement.closest('.commits-wrapper');
            this.ui.addObserverOnFirstCommitVisibilityOfRepo(commitsElement, commitsWrapper);
            this.ui.addObserverOnLastCommitVisibilityOfRepo(commitsElement, commitsWrapper);
          });
        },

        addObserverOnFirstCommitVisibilityOfRepo: (commitsElement, commitsWrapper) => {
          const previousCommitsIconElement = commitsWrapper.querySelector('.left-arrow-icon');
          const firstCommitElement = commitsElement.querySelector('a:first-of-type');
          const firstCommitObserver = new IntersectionObserver(
            entries => {
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

        addObserverOnLastCommitVisibilityOfRepo: (commitsElement, commitsWrapper) => {
          const nextCommitsIconElement = commitsWrapper.querySelector('.right-arrow-icon');
          const lastCommitElement = commitsElement.querySelector('a:last-of-type');
          const lastCommitObserver = new IntersectionObserver(
            entries => {
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

        deleteCommit: (repoIdentifier, index) => {
          this.$delete(this.notifications[repoIdentifier], index);
          // if there are no more notifications related to current repo, delete the repo.
          if (this.notifications[repoIdentifier].length == 0) {
            this.ui.deleteRepoRow(repoIdentifier);
          }
        },

        deleteRepoRow: repoIdentifier => {
          this.$delete(this.notifications, repoIdentifier);
        },
      };
    },

    // Methods that affect Storage. Access inside methods with `this.storage`
    storageMethods() {
      return {
        deleteRepoInfoFromStorage,
        getAllReposNotifications: notificationsStorage.getAllReposNotifications,
        getTotalNumberOfPendingNotifications: notificationsStorage.getTotalNumberOfPendingNotifications,
        updatePendingNotificationsCount: notificationsStorage.updatePendingNotificationsCount,
        deleteSingleNotificationOfRepo: notificationsStorage.deleteSingleNotificationOfRepo,
        deleteAllNotificationsOfRepo: notificationsStorage.deleteAllNotificationsOfRepo,
      };
    },

    // Methods that affect both UI and Storage. Access inside methods with `this.uiStorage`
    uiStorageMethods() {
      return {
        unsubscribeRepo: async repoIdentifier => {
          await this.storage.deleteRepoInfoFromStorage(repoIdentifier);
          const repoPendingNotificationsCount = this.notifications[repoIdentifier].length;
          this.uiStorage.decrementPendingNotificationsCountBy(repoPendingNotificationsCount);
          this.ui.deleteRepoRow(repoIdentifier);

          this.$root.$emit('rerender-subscription-list-screen');
        },

        deleteSelectedReposNotifications: async () => {
          // await does not work inside forEach loop, so using for..Of
          // eslint-disable-next-line no-restricted-syntax
          for (const repoIdentifier of this.selectedRepos) {
            // eslint-disable-next-line no-await-in-loop
            await this.storage.deleteAllNotificationsOfRepo(repoIdentifier);

            const repoPendingNotificationsCount = this.notifications[repoIdentifier].length;
            this.uiStorage.decrementPendingNotificationsCountBy(repoPendingNotificationsCount);

            this.ui.deleteRepoRow(repoIdentifier);
          }

          this.selectedRepos = [];
        },

        deleteCommit: async (repoIdentifier, commitSha, index) => {
          this.ui.deleteCommit(repoIdentifier, index);
          this.uiStorage.decrementPendingNotificationsCountBy(1);
          this.storage.deleteSingleNotificationOfRepo(repoIdentifier, commitSha);
        },

        decrementPendingNotificationsCountBy: count => {
          this.pendingNotificationsCount -= count;
          this.storage.updatePendingNotificationsCount(this.pendingNotificationsCount);
        },
      };
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
