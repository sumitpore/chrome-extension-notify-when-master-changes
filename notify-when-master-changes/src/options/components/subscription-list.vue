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
          <button class="trash-icon" title="Unsubscribe" @click="unsubscribeRepo(repoIdentifier)"></button>
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
import { getAllReposFromStorage, removeMultipleRepoInfoFromStorage, removeRepoInfoFromStorage } from '../../data-layer/repo-info-storage-api';
import { getRepoUrlFromIdentifier } from '../../utils';

export default {
  name: 'SubscriptionList',

  data: function() {
    return {
      savedRepos: {},
      selectedRepos: [],
    };
  },

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
    getRepoUrlFromIdentifier,

    unsubscribeRepo: function(repoIdentifier) {
      removeRepoInfoFromStorage(repoIdentifier);
      if (typeof this.savedRepos[repoIdentifier] == 'undefined') return;
      this.$delete(this.savedRepos, repoIdentifier);
    },

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
$distanceFromLeft: 30px;

.repo-item {
  @include allSidesCollapsedBorder(1px, var(--primary-border-color));
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 25px 10px 25px $distanceFromLeft;
  background: var(--table-bg-color);

  &:first-of-type {
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
  }

  &:last-of-type {
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
  }

  &.no-items {
    @include largeText;
    font-weight: 600;
    justify-content: center;
    color: var(--secondary-color);
  }
}

.repo-title {
  width: 90%;

  a {
    @include largeText;
    font-weight: 600;
    vertical-align: middle;
    color: var(--primary-color);
    text-decoration: none;
    margin-left: 10px;
  }
}

.action-items {
  width: 10%;
  text-align: center;
}

.primary-btn {
  margin-left: $distanceFromLeft;
  margin-top: 25px;
}
</style>
