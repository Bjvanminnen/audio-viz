import Grapher from './grapher';
import { loadBuffer } from './webAudio';
import { Source, Gain, Processor, Analyzer, Destination } from './createFunctionalAudioGraph';

// TODO - understand this block
var graphers = [];
function getGrapher(id) {
  if (!graphers[id]) {
    var c = document.getElementById(id);
    if (!c) {
      return null;
    }
    graphers[id] = new Grapher(c);
  }
  return graphers[id];
}

function onAudioProcess(audioEvent) {
  var numChannels = 2;
  for (var channel = 0; channel < numChannels; channel++) {
    var input = audioEvent.inputBuffer.getChannelData(channel);
    var output = audioEvent.outputBuffer.getChannelData(channel);

    var sums = [];
    var blockSize = 512;
    for (var i = 0; i < input.length; i++) {
      output[i] = input[i];
      var sumIndex = Math.floor(i / blockSize);
      if (sums[sumIndex] === undefined) {
        sums[sumIndex] = 0;
      }
      sums[sumIndex] -= Math.abs(output[i]);
    }

    for (i = 0; i < sums.length; i++) {
      sums[i] = sums[i] / blockSize / 2;
    }

    getGrapher('c' + channel).graph(sums);
  }
}


function createGraph() {
  const source = Source(
    Gain({value: 1},
      Processor({onAudioProcess: onAudioProcess},
        Analyzer(),
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
