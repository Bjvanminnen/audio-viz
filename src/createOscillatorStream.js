import {
  Oscillator,
  Gain,
  Processor,
  Destination,
  disconnectGraph
} from './functionalAudioNodes';
import createGraphProcessor from './createGraphProcessor';

export default function createOscillatorStream(options = {}) {
  let root;
  const { frequency, color } = options;

  const onAudioProcess = createGraphProcessor({id: 'c0', color });

  let nodes = {};

  return {
    start() {
      root = Oscillator({frequency},
        Gain({value: 1},
          Processor({onAudioProcess: onAudioProcess},
            Gain({value: 1},
              Destination(),
            )
          )
        )
      );
      root.onended = () => disconnectGraph(root);
      root.start();

      nodes.pregain = root._targets[0];
      nodes.processor = nodes.pregain._targets[0];
      nodes.postgain = nodes.processor._targets[0];
    },
    stop() {
      root.stop();
    },
    setVolume(volume) {
      const gainNode = 'pregain';
      if (!nodes[gainNode]) {
        return;
      }
      nodes[gainNode].gain.value = volume;
    },
    adjustVolume(delta) {
      if (!nodes.pregain) {
        return;
      }      
      nodes.pregain.gain.value += delta;
      return nodes.pregain.gain.value;
    }
  };
}
