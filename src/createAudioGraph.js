import { loadBuffer } from './webAudio';
import {
  SourceBuffer,
  Gain,
  Processor,
  Destination,
  Oscillator,
  disconnectGraph
} from './functionalAudioNodes';
import createGraphProcessor from './createGraphProcessor';

function createGraph(SourceNode, options = {}) {
  let source;
  return {
    _start(buffer) {
      const onAudioProcess = createGraphProcessor({id: 'c0', color: 'red' },
        {id: 'c1', color: 'yellow'});

      source = SourceNode(options,
        Processor({onAudioProcess: onAudioProcess},
          Gain({value: 1},
            Destination(),
          )
        )
      );
      source.onended = () => {
        disconnectGraph(source);
      };

      if (buffer) {
        source.buffer = buffer;
      }
      source.start();
    },
    stop() {
      source.stop();
    },
    adjustVolume(delta) {
      if (!source || source._targets.length === 0) {
        return;
      }
      const gainNode = source._targets[0]._targets[0];
      gainNode.gain.value += delta;
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
      graph = createGraph(Oscillator, { frequency: 1000 });
      resolve();
    }
  }).then(buffer => {
    // extend graph with a play method
    graph.play = () => {
      graph._start(buffer);
    };
    return graph;
  }).catch(err => console.log(err));
}
