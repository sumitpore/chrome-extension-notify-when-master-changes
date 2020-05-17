import { getRepoUrlFromIdentifier } from '../utils';
import { deleteRepoInfoFromStorage } from '../data-layer/repo-info-storage-api';

export default {
  data() {
    return {
      selectedRepos: [],
    };
  },
  methods: {
    getRepoUrlFromIdentifier,
    unsubscribeRepo(repoIdentifier) {
      deleteRepoInfoFromStorage(repoIdentifier);
      if (typeof this.savedRepos[repoIdentifier] == 'undefined') return;
      this.$delete(this.savedRepos, repoIdentifier);
    },
  },
};
