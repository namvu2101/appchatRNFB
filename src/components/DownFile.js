import RNFetchBlob from 'rn-fetch-blob';

export const downloadFile = (name, uri) => {
  const {config, fs} = RNFetchBlob;
  const date = new Date();
  const fileDir = fs.dirs.DownloadDir;
  config({
    // add this option that makes response data to be stored as a file,
    // this is much more performant.
    fileCache: true,
    addAndroidDownloads: {
      useDownloadManager: true,
      notification: true,
      path:
        fileDir +
        '/Tải_xuống_' +
        Math.floor(date.getDate() + date.getSeconds() / 2) +
        `${name}`,
      description: 'file download',
    },
  }).fetch('GET', uri, {
    //some headers ..
  });
};
