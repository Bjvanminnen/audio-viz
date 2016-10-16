import Grapher from './grapher';
import { loadBuffer } from './webAudio';
import {
  SourceBuffer,
  Gain,
  Processor,
  Destination,
  Oscillator,
  disconnectGraph
} from './functionalAudioNodes';

const createGrapherProcessor = graphers => {
 return function onAudioProcess(audioEvent) {
   console.log('oap');
    const numChannels = 2;
    for (let channel = 0; channel < numChannels; channel++) {
      const input = audioEvent.inputBuffer.getChannelData(channel);
      let output = audioEvent.outputBuffer.getChannelData(channel);

      let sums = [];
      const blockSize = 512;
      for (let i = 0; i < input.length; i++) {
        output[i] = input[i];
        const sumIndex = Math.floor(i / blockSize);
        if (sums[sumIndex] === undefined) {
          sums[sumIndex] = 0;
        }
        sums[sumIndex] -= Math.abs(output[i]);
      }

      for (let i = 0; i < sums.length; i++) {
        sums[i] = sums[i] / blockSize / 2;
      }

      graphers[channel].drawLine();
      graphers[channel].graph(output);
    }
  };
}

function createGraph(SourceNode) {
  const graphers = [
    new Grapher(document.getElementById('c0'), { style: 'blue' }),
    new Grapher(document.getElementById('c1'))
  ];

  let source;
  return {
    start(buffer) {
      const onAudioProcess = createGrapherProcessor(graphers);

      source = SourceNode(
        Processor({onAudioProcess: onAudioProcess},
          Gain({value: 1},
            Destination(),
          )
        )
      );
      source.onended = () => {
        disconnectGraph(source);
        console.log('disconnected');
      };

      if (buffer) {
        source.buffer = buffer;
      }
      source.start();
    },
    mute() {
      if (!source || source._targets.length === 0) {
        return;
      }
      const gainNode = source._targets[0]._targets[0];
      gainNode.gain.value = 0;
    }
  };
};

export function createAudioGraph(file) {
  let graph;

  return new Promise((resolve, reject) => {
    if (file) {
      graph = createGraph(SourceBuffer);
      resolve(loadBuffer(file));
    } else {
      graph = createGraph(Oscillator);
      resolve();
    }
  }).then(buffer => {
    return {
      play() {
        graph.start(buffer);
      },
      mute() {
        graph.mute();
      }
    };
  }).catch(err => console.log(err));
}
