<template>
  <div class="container">
    <h1>List of Subscribed Repositories</h1>
    <section v-if="!emptyReposList">
      <div v-for="(repoInfo, repoIdentifier) in savedRepos" :key="repoIdentifier" class="repo-item">
        <div class="repo-title">
          <input type="checkbox" v-model="selectedRepos" :value="repoIdentifier" />
          <a :href="getRepoUrlFromIdentifier(repoIdentifier)" target="_blank">{{ repoIdentifier }}</a>
        </div>
        <div class="action-items">
          <button class="mute-icon" title="Unsubscribe" @click="unsubscribeRepo(repoIdentifier)"></button>
        </div>
      </div>
      <button class="primary-btn" :disabled="selectedRepos.length == 0" @click="unsubscribeSelectedRepos">Unsubscribe</button>
    </section>
    <section v-else>
      <div class="repo-item no-items">Visit Github Repository of your choice and click 'Subscribe to Master' button.</div>
    </section>
  </div>
</template>

<script>
import { getRepoUrlFromIdentifier } from '../../utils';
import { getAllReposFromStorage, deleteMultipleRepoInfoFromStorage, deleteRepoInfoFromStorage } from '../../data-layer/repo-info-storage-api';
import { getTotalNumberOfPendingNotifications, getPendingNotificationsCountOfRepo, updatePendingNotificationsCount } from '../../data-layer/notifications-storage-api';

export default {
  name: 'SubscriptionList',

  data() {
    return {
      selectedRepos: [],
      savedRepos: {},
    };
  },

  computed: {
    emptyReposList() {
      return Object.keys(this.savedRepos).length === 0;
    },
  },

  async mounted() {
    this.$root.$on('rerender-subscription-list-screen', async () => {
      this.savedRepos = await this.getSavedRepos();
      this.selectedRepos = [];
    });

    this.savedRepos = await this.getSavedRepos();
  },

  methods: {
    getRepoUrlFromIdentifier,

    async getSavedRepos() {
      const savedRepos = await getAllReposFromStorage();
      if (savedRepos != null) {
        return savedRepos;
      }
      return {};
    },

    async unsubscribeSelectedRepos() {
      await deleteMultipleRepoInfoFromStorage(this.selectedRepos);
      const { selectedRepos } = this;

      selectedRepos.forEach(repoIdentifier => {
        if (typeof this.savedRepos[repoIdentifier] === 'undefined') return;
        this.$delete(this.savedRepos, repoIdentifier);
      });

      // Update Pending Notification Count in storage.
      const totalPendingNotificationsCount = await getTotalNumberOfPendingNotifications();
      let selectedReposPendingNotificationCount = 0;
      // eslint-disable-next-line no-restricted-syntax
      for (const repoIdentifier of this.selectedRepos) {
        // eslint-disable-next-line no-await-in-loop
        selectedReposPendingNotificationCount += await getPendingNotificationsCountOfRepo(repoIdentifier);
      }
      await updatePendingNotificationsCount(totalPendingNotificationsCount - selectedReposPendingNotificationCount);

      this.selectedRepos = [];

      this.$root.$emit('rerender-notifications-list-screen');
    },

    async unsubscribeRepo(repoIdentifier) {
      if (typeof this.savedRepos[repoIdentifier] == 'undefined') return;
      this.$delete(this.savedRepos, repoIdentifier); // update ui

      // Update Pending Notification Count in storage.
      const totalPendingNotificationsCount = await getTotalNumberOfPendingNotifications();
      const repoPendingNotificationsCount = await getPendingNotificationsCountOfRepo(repoIdentifier);
      await updatePendingNotificationsCount(totalPendingNotificationsCount - repoPendingNotificationsCount);

      await deleteRepoInfoFromStorage(repoIdentifier);

      this.$root.$emit('rerender-notifications-list-screen');
    },
  },
};
</script>

<style lang="scss">
.repo-title {
  width: 90%;
}

.action-items {
  width: 10%;
  text-align: center;
}
</style>
