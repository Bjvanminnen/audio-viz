/*eslint-disable no-unused-vars */

import getStore from './redux/getStore';
import { loadBuffer } from './utils/webAudio';
import { addStream, setPlayStream, setInfoStream } from './redux/dataStreams';

import * as bufferMods from './utils/bufferModification';

const notes = {
  A1: 55,
  A2: 110,
  C4: 261.63,
  D4: 293.66,
  E4: 329.63
};

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



  const base = bufferMods.create(200000);
  const one = bufferMods.sin(base, notes.A2);
  const two = bufferMods.sin(base, notes.A1);
  const combo = bufferMods.combine(one, two);
  const mult = bufferMods.multiply(one, two);

  store.dispatch(addStream('A2', one));
  store.dispatch(addStream('A1', two));
  store.dispatch(addStream('combo', combo));
  store.dispatch(addStream('mult', mult));

}
