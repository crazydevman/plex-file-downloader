function findServer(serverId) {
  var users = JSON.parse(window.localStorage['users'])["users"];
  for (const user of users) {
    for (const server of user.servers) {
      if (server.machineIdentifier == serverId) {
        return server;
      }
    }
  }
  return null;
}

async function queryForDownloadInfo(url) {
  const response = await fetch(url, {headers: {'Accept': "application/json"}});
  const metadata = await response.json();
  // Metadata response contains download file key
  var part = metadata.MediaContainer.Metadata[0].Media[0].Part[0];
  return {
    'key': part.key,
    'name': part.file.replace(/^.*[\\\/]/, '')
  };
}

var hash = window.location.hash.substr(1);
var parts = hash.split('?');
var serverId = parts[0].split('/')[2];
var metadataId = decodeURIComponent(parts[1].split('&')[0].split('=')[1]);
var server = findServer(serverId);

// Create url to query plex server with metadata key to get file info
var url = new URL(metadataId, server.connections[0].uri);
var params = {'X-Plex-Token':server.accessToken}
url.search = new URLSearchParams(params).toString();

queryForDownloadInfo(url).then(downloadInfo => {
  console.log('downloadInfo: ', downloadInfo);
  var fullUrl = new URL(downloadInfo.key, server.connections[0].uri);
  params['download'] = 1;
  fullUrl.search = new URLSearchParams(params).toString();
  console.log('fullUrl:', fullUrl.href);
  chrome.extension.sendRequest({'name': downloadInfo.name, 'url':fullUrl.href});
});

