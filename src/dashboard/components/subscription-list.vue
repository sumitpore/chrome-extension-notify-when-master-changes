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
import { deleteMultipleRepoInfoFromStorage } from '../../data-layer/repo-info-storage-api';
import mixin from '../../shared/vue-mixins';

export default {
  name: 'SubscriptionList',

  mixins: [mixin],

  props: {
    savedRepos: {
      type: Object,
    },
  },

  computed: {
    emptyReposList() {
      return Object.keys(this.savedRepos).length === 0;
    },
  },

  methods: {
    unsubscribeSelectedRepos() {
      deleteMultipleRepoInfoFromStorage(this.selectedRepos);
      const { selectedRepos } = this;

      selectedRepos.forEach(repoIdentifier => {
        if (typeof this.savedRepos[repoIdentifier] === 'undefined') return;
        this.$delete(this.savedRepos, repoIdentifier);
      });

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
