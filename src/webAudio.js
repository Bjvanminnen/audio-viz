let context;
export function getContext () {
  if (context) {
    return context;
  }

  if (typeof AudioContext !== "undefined") {
    context = new AudioContext();
  } else if (typeof window.webkitAudioContext !== "undefined") {
    context = new window.webkitAudioContext();
  } else {
    throw new Error('AudioContext not supported. :(');
  }

  return context;
}

/**
 * Decodes the audio resource at url.
 * @param {string} url
 * @param {AudioContext}
 * @returns Promise<ArrayBuffer>
 */
export function loadBuffer(url) {
  return new Promise((resolve, reject) => {
    let request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.responseType = "arraybuffer";

    // Our asynchronous callback
    request.onload = () => {
      getContext().decodeAudioData(request.response)
      .then(buffer => {
        console.log('decoded: ' + buffer.length);
        resolve(buffer);
      });
    };

    request.onerror = err => {
      console.log(err);
      reject(err);
    };

    request.send();
  });
};
