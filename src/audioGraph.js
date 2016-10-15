import Grapher from './grapher';
import { loadBuffer } from './webAudio';
import { Source, Gain, Processor, Analyzer, Destination } from './createFunctionalAudioGraph';

const createGrapherProcessor = graphers => {
 return function onAudioProcess(audioEvent) {
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

      graphers[channel].graph(sums);
    }
  };
}


function createGraph() {
  const graphers = [
    new Grapher(document.getElementById('c0')),
    new Grapher(document.getElementById('c1'))
  ];

  const onAudioProcess = createGrapherProcessor(graphers);

  const source = Source(
    Gain({value: 1},
      Processor({onAudioProcess: onAudioProcess},
        // Analyzer(),
        Destination()
      )
    )
  );

  return {
    start(buffer) {
      source.buffer = buffer;
      source.start();
    },
    mute() {
      const gainNode = source._targets[0];
      gainNode.gain.value = 0;
    }
  };
};

export function getFile(file) {
  let graph = createGraph();

  return loadBuffer(file).then(buffer => {
    return {
      play() {
        graph.start(buffer);
      },
      mute() {
        graph.mute();
      }
    };
  });
}
