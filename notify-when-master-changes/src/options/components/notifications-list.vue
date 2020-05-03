<template>
  <div class="container">
    <h1>Notifications</h1>
    <section v-if="!emptyNotificationList">
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
            <a v-for="commit in commits" :key="commit.sha" :title="commit.message" :href="`https://github.com/${repoIdentifier}/commit/${commit.sha}`">{{
              commit.sha.substring(0, 7)
            }}</a>
          </div>
          <button
            v-if="commits.length > minCommitsCountForCarousel"
            class="right-arrow-icon"
            :id="`${repoIdentifier}-next-commits-icon`"
            @click="showNextCommits(repoIdentifier)"
          ></button>
        </div>

        <div class="action-items">
          <button class="mute-icon" title="Unsubscribe" @click="unsubscribeRepo(repoIdentifier)"></button>
        </div>
      </div>
      <button class="primary-btn" :disabled="selectedRepos.length == 0" @click="markSelectedReposNotificationRead">Mark Read</button>
    </section>

    <section v-else>
      <div class="repo-item no-items">Chill buddy, no new notifications! Everything Caught Up!</div>
    </section>
  </div>
</template>

<script>
import mixin from '../../shared/vue-mixins';

export default {
  name: 'NotificationsList',

  mixins: [mixin],
  // 'getredash/redash': [
  //   {
  //     sha: '175aefa0b85ed9a740636f816495479e57870d9d',
  //     message: 'minor fixes',
  //   },
  // ],
  data: function() {
    return {
      minCommitsCountForCarousel: 3,
      notifications: {
        'getredash/redash': [
          {
            sha: '175aefa0b85ed9a740636f816495479e57870d9d',
            message: 'minor fixes',
          },
        ],
      },
      singleCommitElementWidth: 0,
    };
  },

  mounted: async function() {
    if (this.emptyNotificationList) {
      return;
    }

    await this.$nextTick();

    let singleCommitElement = document.querySelector('.commits a:first-of-type');
    if (singleCommitElement != null) {
      this.singleCommitElementWidth = singleCommitElement.clientWidth;
    }

    this.controlVisibilityPreviousAndNextIcons();
  },

  computed: {
    emptyNotificationList: function() {
      return Object.keys(this.notifications).length === 0;
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

    markSelectedReposNotificationRead: function() {},
  },
};
</script>

<style lang="scss" scoped>
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
