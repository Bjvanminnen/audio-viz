import Grapher from './grapher';
import { getContext, loadBuffer } from './webAudio';
import { createFunctionalAudioGraph } from './createFunctionalAudioGraph';

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

function createGraph() {
  var startTime;

  const source = createFunctionalAudioGraph();
  const gain = source._targets[0];
  const processor = gain._targets[0];
  const analyzer = processor._targets[0];

  extendProcessor(processor, {});

  return {
    start(buffer) {
      startTime = getContext().currentTime;
      source.buffer = buffer;
      source.start();

      source.onended = () => {
        setTimeout(() => processor.onended(), 1000);
      };
    },
    mute() {
      gain.gain.value = 0;
    },
    runTime() {
      return getContext().currentTime - startTime;
    }
  };
};

function createGraph2() {
  // BUFFER -> DESTINATION
  const ctx = getContext();
  const source = ctx.createBufferSource();
  source.connect(ctx.destination);

  return {
    play(audioBuffer) {
      source.buffer = audioBuffer;
      source.start();
    }
  };
}

export function getFile(file) {
  const options = {};
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

/**
 * EXTENDERS
 */

function extendProcessor(node, options) {
  node.onaudioprocess = function (audioEvent) {
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
}
