/*eslint-disable no-unused-vars */

import getStore from './redux/getStore';
import { loadBuffer } from './utils/webAudio';
import { addStream, setPlayStream, setInfoStream } from './redux/dataStreams';
import dsp from './utils/dsp';
import ignorantDFT from './utils/ignorantDFT';

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
function addFile(filename, id) {
  return new Promise((resolve, reject) => {
    id = id || filename;
    const filepath = process.env.PUBLIC_URL + '/sounds/' + filename;
    loadBuffer(filepath).then(buffer => {
      const data = buffer.getChannelData(0);
      store.dispatch(addStream(id, data));
      resolve(data);
    });
  });
}

export default function initializeStore() {
  const filename = 'heartbeats.mp3';
  addFile(filename, 'song').then((data) => {
    store.dispatch(addStream('averagedDelta', bufferMods.averagedDelta(data), false));

    store.dispatch(setInfoStream('averagedDelta'));
    // store.dispatch(setPlayStream(filename));



    // const base = bufferMods.create(200000);
    // const one = bufferMods.sin(base, notes.A2, 3);
    // const two = bufferMods.sin(base, notes.A1, 2);

    // const A = bufferMods.constant(base, 0.5);
    // const B = bufferMods.sinWaveLength(base, 2, 0.52, 0.5);
    // const C = bufferMods.sinWaveLength(base, 16, 0.78, 0.3);


    // store.dispatch(addStream('C', C));
    // store.dispatch(addStream('combo', bufferMods.combine(A, B, C)));
    // store.dispatch(addStream('mult', bufferMods.multiply(one, two)));

    // const base = bufferMods.create(Math.pow(2, 12));
    // const A2 = bufferMods.sin(base, notes.A2);
    // const powers = ignorantDFT(A2);
    // const A1 = bufferMods.sin(bufferMods.create(Math.pow(2, 12)), notes.A1);
    // const f70 = bufferMods.sin(bufferMods.create(Math.pow(2, 12)), 70);
    // store.dispatch(addStream('powers', powers));
    // store.dispatch(addStream('A2', A2));


    // store.dispatch(addStream('A1', A1));
    // store.dispatch(addStream('f70', f70));

    // let sum1 = 0;
    // let sum2 = 0;
    // let sum3 = 0;
    // for (let i = 0; i < A2.length; i++) {
    //   sum1 += A2[i] * A2[i];
    //   sum2 += A2[i] * A1[i];
    //   sum3 += A2[i] * f70[i];
    // }
    // console.log(sum1);
    // console.log(sum2);
    // console.log(sum3);


    // const combo = bufferMods.combine(A1, A2);
    //
    // const output = A2.slice(0);
    // const dft = new dsp.FFT(output.length, 44100);
    // dft.forward(output);
    // window.__dft = dft;
    // const spectrum = dft.spectrum;
    // store.dispatch(addStream('combo', combo));
    // store.dispatch(addStream('output', spectrum));
    // store.dispatch(setInfoStream('output'));
  });
}
