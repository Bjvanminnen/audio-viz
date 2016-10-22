import getStore from './redux/getStore';
import { loadBuffer } from './utils/webAudio';
import { addStream, setPlayStream } from './redux/dataStreams';

import { bufferMod1 } from './utils/bufferModification';

const store = getStore();

// TODO - could make this part of a thunk action?
function addFile(filename) {
  const filepath = process.env.PUBLIC_URL + '/sounds/' + filename;
  loadBuffer(filepath).then(buffer => {
    const data = buffer.getChannelData(0);
    store.dispatch(addStream(filename, data));
    store.dispatch(addStream('mod', bufferMod1(data)));
  });
}

export default function initializeStore() {
  addFile('bloop.wav');
  store.dispatch(setPlayStream('bloop.wav'));
}
