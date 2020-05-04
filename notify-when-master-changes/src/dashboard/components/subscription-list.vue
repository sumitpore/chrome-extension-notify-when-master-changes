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
      <div class="repo-item no-items">No Github Repo added to watch for Master changes!</div>
    </section>
  </div>
</template>

<script>
import { getAllReposFromStorage, removeMultipleRepoInfoFromStorage } from '../../data-layer/repo-info-storage-api';
import mixin from '../../shared/vue-mixins';

export default {
  name: 'SubscriptionList',

  mixins: [mixin],

  created: async function() {
    let savedRepos = await getAllReposFromStorage();
    if (savedRepos != null) {
      this.savedRepos = savedRepos;
    }
  },

  computed: {
    emptyReposList: function() {
      return Object.keys(this.savedRepos).length === 0;
    },
  },

  methods: {
    unsubscribeSelectedRepos: function() {
      for (let repoIdentifier of this.selectedRepos) {
        if (typeof this.savedRepos[repoIdentifier] == 'undefined') continue;
        this.$delete(this.savedRepos, repoIdentifier);
      }
      removeMultipleRepoInfoFromStorage(this.selectedRepos);

      this.selectedRepos = [];
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
