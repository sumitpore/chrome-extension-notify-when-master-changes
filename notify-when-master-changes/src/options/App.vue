<template>
  <vue-tabs>
    <v-tab title="Notifications">Notification Tab</v-tab>

    <v-tab title="Subscription List">
      <SubscriptionList />
    </v-tab>

    <v-tab title="Options">Second tab content</v-tab>
  </vue-tabs>
</template>

<script>
import { VueTabs, VTab } from 'vue-nav-tabs';
import SubscriptionList from './components/subscription-list';

export default {
  name: 'App',
  components: {
    VueTabs,
    VTab,
    SubscriptionList,
  },
};
</script>

<style lang="scss">
.vue-tabs .tabs__link {
  text-decoration: none;
  color: gray;
}

.vue-tabs .nav {
  margin-bottom: 0;
  margin-top: 0;
  padding-left: 0;
  list-style: none;
}

.vue-tabs .nav:before,
.vue-tabs .nav:after {
  content: ' ';
  display: table;
}

.vue-tabs .nav:after {
  clear: both;
}

.vue-tabs .nav > li {
  position: relative;
  display: block;
}

.vue-tabs .nav > li > a {
  position: relative;
  display: block;
  padding: 10px 15px;
}

.vue-tabs .nav > li > a:hover,
.vue-tabs .nav > li > a:focus {
  text-decoration: none;
  background-color: #eeeeee;
}
.vue-tabs .nav > li span.title {
  display: flex;
  justify-content: center;
}

.vue-tabs .nav-tabs {
  border-bottom: 1px solid #ddd;
}

.vue-tabs .nav-tabs > li {
  float: left;
  margin-bottom: -1px;
}

.vue-tabs .nav-tabs > li > a {
  margin-right: 2px;
  line-height: 1.42857;
  border: 1px solid transparent;
  border-radius: 4px 4px 0 0;
}

.vue-tabs .nav-tabs > li > a:hover {
  border-color: #eeeeee #eeeeee #ddd;
}

.vue-tabs .nav-tabs > li.active > a,
.vue-tabs .nav-tabs > li.active > a:hover,
.vue-tabs .nav-tabs > li.active > a:focus {
  color: var(--primary-color);
  background-color: #fff;
  border: 1px solid #ddd;
  border-bottom-color: transparent;
  cursor: default;
}

.vue-tabs .nav-tabs-navigation {
  text-align: center;
  border-bottom: 1px solid var(--primary-border-color);
  margin-bottom: 30px;
}
.vue-tabs .nav-tabs-navigation .nav > li > a {
  padding-bottom: 20px;
}

.vue-tabs .nav-tabs-wrapper {
  display: inline-block;
  margin-bottom: -6px;
  position: relative;
  width: 100%;
}

.vue-tabs .nav-tabs {
  @include smallText;
  border-bottom: 0 none;
  font-weight: 600;
}

.vue-tabs .nav-tabs > li > a {
  border: 0 none !important;
  color: var(--secondary-color);
}

.vue-tabs .nav-tabs > li > a:hover {
  color: var(--primary-hover-color);
  background-color: transparent;
}

.vue-tabs .nav-tabs > li.active {
  color: var(--primary-hover-color);
  position: relative;
}

.vue-tabs .nav-tabs > li.active > a,
.vue-tabs .nav-tabs > li.active > a:hover,
.vue-tabs .nav-tabs > li.active > a:focus {
  background-color: transparent;
  border: 0 none;
}

.vue-tabs .nav-tabs > li.active a:after {
  background: url('../svg-icons/up-arrow.svg');
  content: '';
  display: inline-block;
  position: absolute;
  right: calc(50% - 8px);
  bottom: 2px;
  width: 22px;
  height: 12px;
}
</style>
