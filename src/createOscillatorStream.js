import {
  Oscillator,
  Gain,
  Processor,
  Destination,
  disconnectGraph
} from './functionalAudioNodes';
import createGraphProcessor from './createGraphProcessor';

export default function createOscillatorStream(frequency) {
  let root;

  const onAudioProcess = createGraphProcessor({id: 'c0', color: 'red' },
    {id: 'c1', color: 'yellow'});

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
    mute() {
      if (!nodes.postgain) {
        return;
      }
      nodes.postgain.gain.value = 0;
    },
    adjustVolume(delta) {
      if (!nodes.pregain) {
        return;
      }
      const gainNode = root._targets[0]._targets[0];
      nodes.pregain.gain.value += delta;
      return nodes.pregain.gain.value;
    }
  };
}
