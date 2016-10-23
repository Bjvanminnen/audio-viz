/*eslint-disable no-unused-vars */

import getStore from './redux/getStore';
import { loadBuffer } from './utils/webAudio';
import { addStream, setPlayStream, setInfoStream } from './redux/dataStreams';

import * as bufferMods from './utils/bufferModification';

const store = getStore();

// TODO - could make this part of a thunk action?
function addFile(filename) {
  const filepath = process.env.PUBLIC_URL + '/sounds/' + filename;
  loadBuffer(filepath).then(buffer => {
    const data = buffer.getChannelData(0);
    store.dispatch(addStream(filename, data));
    // store.dispatch(addStream('mod', bufferMod1(data)));
  });
}

export default function initializeStore() {
  // const filename = 'firstfires.mp3';
  // addFile(filename);
  // store.dispatch(setPlayStream(filename));
  // store.dispatch(setInfoStream(filename));

  const base = bufferMods.create(50000);
  const one = bufferMods.sin(base, 40);
  const two = bufferMods.sin(base, 30);
  const combo = bufferMods.combine(one, two);

  store.dispatch(addStream('one', one));
  store.dispatch(addStream('two', two));
  store.dispatch(addStream('combo', combo));
  store.dispatch(setPlayStream('combo'));
}
