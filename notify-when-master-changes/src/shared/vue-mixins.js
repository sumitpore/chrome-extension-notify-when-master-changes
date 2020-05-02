import { getRepoUrlFromIdentifier } from '../utils';
import { removeRepoInfoFromStorage } from '../data-layer/repo-info-storage-api';

export default {
  data: function() {
    return {
      savedRepos: {},
      selectedRepos: [],
    };
  },
  methods: {
    getRepoUrlFromIdentifier,
    unsubscribeRepo: function(repoIdentifier) {
      removeRepoInfoFromStorage(repoIdentifier);
      if (typeof this.savedRepos[repoIdentifier] == 'undefined') return;
      this.$delete(this.savedRepos, repoIdentifier);
    },
  },
};
