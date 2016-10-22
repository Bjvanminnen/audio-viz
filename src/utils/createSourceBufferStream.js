import { loadBuffer } from './webAudio';
import {
  SourceBuffer,
  Gain,
  Processor,
  Destination,
  disconnectGraph
} from './functionalAudioNodes';
import createGraphProcessor from './createGraphProcessor';

function createFromBuffer(buffer) {
  let root;

  const onAudioProcess = createGraphProcessor(
    {id: 'c0', color: 'red' },
    {id: 'c1', color: 'yellow'});

  return {
    start() {
      root = SourceBuffer({buffer},
        Processor({onAudioProcess: onAudioProcess},
          Gain({value: 1},
            Destination(),
          )
        )
      );
      root.onended = () => disconnectGraph(root);
      root.start();
    },
    stop() {
      root.stop();
    },
    mute() {
      if (!root || root._targets.length === 0) {
        return;
      }
      const gainNode = root._targets[0]._targets[0];
      gainNode.gain.value = 0;
    }
  };
}

export default function createSourceBufferStream(filepath) {
  return loadBuffer(filepath)
  .then(createFromBuffer);
}
