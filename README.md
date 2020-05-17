# Subscribe to Master Chrome Extension

The purpose of this chrome extension is to notify when master branch of a
desired repository gets a new update.

## Why?

Github provides an awesome 'Watch Releases only' feature on a repo page which
sends notfication when a new version of the software is released. So why is this
extension needed?

This chrome extension will come handy when

1. Repository you are interested in does not use 'Releases' (e.g. javascript-tutorial/en.javascript.info)
2. You want to get to notification when the repository you admire gets new
   change. (Think of it like a regular exercise for reading a good code)

## How this works?

1. Go to Repository page you are interested in.
2. Click 'Subscribe to Master' button.
3. When there are new commits to master branch of the repo, you will get a
   browser notification. Extension icon in Tool bar will show number of Pending Notifications, so that if
   you miss browser notification, you will still know that there are new notifications.

Extension will check every 2 hours for the updates of repositories you have
subscribed to.

This extension works only with Public Repositories.

### Known Bugs

1. Sometimes 'Subscribe To Master' button is shown twice.
