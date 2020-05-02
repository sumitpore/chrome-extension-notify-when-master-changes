const isValidRepoUrl = function(url) {
  if (!url || url.length === 0) {
    return false;
  }

  if (!url.startsWith('https://github.com/')) {
    return false;
  }

  url = url.replace('https://github.com/', '');

  if (url.length === 0) {
    return false;
  }

  let urlSegments = url.split('/');

  // urlSegments should have at least 2 segments
  if (urlSegments[1] == null) {
    return false;
  }

  return true;
};

const getRepoIdentifierFromUrl = function(url) {
  if (!isValidRepoUrl(url)) {
    return null;
  }
  url = url.replace('https://github.com/', '');
  let urlSegments = url.split('/');
  return urlSegments[0] + '/' + urlSegments[1];
};

const getRepoUrlFromIdentifier = function(repoIdentifier) {
  return `https://github.com/${repoIdentifier}`;
};

export { getRepoIdentifierFromUrl, getRepoUrlFromIdentifier };
