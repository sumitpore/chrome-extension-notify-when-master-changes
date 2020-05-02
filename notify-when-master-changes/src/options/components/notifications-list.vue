<template>
  <div class="container">
    <h1>Notifications</h1>
    <section v-if="!emptyNotificationList">
      <div v-for="(repoNotifications, repoIdentifier) in notifications" :key="repoIdentifier" class="repo-item">
        <div class="repo-title">
          <input type="checkbox" v-model="selectedRepos" :value="repoIdentifier" />
          <a :href="getRepoUrlFromIdentifier(repoIdentifier)" target="_blank">{{ repoIdentifier }}</a>
        </div>

        <div class="notifications">
          <a
            v-for="notification in repoNotifications"
            :key="notification.sha"
            :title="notification.message"
            :href="`https://github.com/${repoIdentifier}/commit/${notification.sha}`"
            >{{ notification.sha.substring(0, 7) }}</a
          >
        </div>

        <div class="action-items">
          <a href @click.prevent="markRepoNotificationsRead" :key="repoIdentifier">Mark Read</a>
          <button class="mute-icon" title="Unsubscribe" @click="unsubscribeRepo(repoIdentifier)"></button>
        </div>
      </div>
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

  data: function() {
    return {
      notifications: {
        'getredash/redash': [
          {
            sha: '175aefa0b85ed9a740636f816495479e57870d9d',
            message: 'minor fixes',
          },
        ],
      },
    };
  },

  created: function() {
    let dummyNotificationsRepo = 'getredash/redash';
    let sampleObj = {
      sha: '175aefa0b85ed9a740636f816495479e57870d9d',
      message: 'minor fixes',
    };
    this.notifications[dummyNotificationsRepo].push(sampleObj, sampleObj, sampleObj, sampleObj, sampleObj, sampleObj, sampleObj, sampleObj);
  },

  computed: {
    emptyNotificationList: function() {
      return Object.keys(this.notifications).length === 0;
    },
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

.notifications {
  width: 35%;
  overflow-x: scroll;
}

.action-items {
  width: 10%;
  text-align: right;
  margin-right: 30px;

  a {
    margin-right: 8px;
  }
}

.notifications {
  a {
    @include allSidesCollapsedBorder(1px, var(--primary-border-color));
    padding: 5px;
    text-decoration: none;
    color: var(--primary-color);
    background: white;

    &:hover {
      background: var(--primary-color);
      color: white;
    }

    &:first-of-type {
      border-top-left-radius: 5px;
      border-bottom-left-radius: 5px;
    }

    &:last-of-type {
      border-top-right-radius: 5px;
      border-bottom-right-radius: 5px;
    }
  }
}
</style>
