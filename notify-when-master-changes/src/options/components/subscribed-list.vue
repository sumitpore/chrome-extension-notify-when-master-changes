<template>
  <div>
    <h1>List of Subscribed Repositories</h1>
  </div>
</template>

<script>
export default {
  name: 'SubscribedList',

  data: function() {
    return {
      repos: [],
    };
  },

  created: function() {
    chrome.storage.local.get(null, storageItems => {
      if ('options' in storageItems) {
        delete storageItems['options'];
      }
      this.repos = storageItems;
    });
  },
};
</script>
