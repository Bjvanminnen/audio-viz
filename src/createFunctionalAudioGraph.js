import { getContext } from './webAudio';

function resolveInputs(options, ...targets) {
  options = options || {};
  if (options instanceof AudioNode) {
    targets = [options, ...targets];
    options = {};
  }
  return [options, targets];
}


function connect(source, ...targets) {
  source._targets = [];
  targets.forEach(target => {
    source.connect(target);
    source._targets.push(target);
  });
  return source;
}

function Destination() {
  return getContext().destination;
}

function Analyzer() {
  return getContext().createAnalyser();
}

function Processor(options, ...targets) {
  [options, targets] = resolveInputs(options, ...targets);

  const node = getContext().createScriptProcessor(4096);
  return connect(node, ...targets);
}

function Gain(options, ...targets) {
  [options, targets] = resolveInputs(options, ...targets);

  const node = getContext().createGain();
  node.gain.value = options.value || 1;
  return connect(node, ...targets);
}

function Source(options, ...targets) {
  [options, targets] = resolveInputs(options, ...targets);

  const node = getContext().createBufferSource();
  return connect(node, ...targets);
}

export function createFunctionalAudioGraph() {
  return Source(
    Gain({value: 1},
      Processor(
        Analyzer(),
        Destination()
      )
    )
  );
}
