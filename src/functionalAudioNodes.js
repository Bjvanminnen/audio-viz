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

export function Destination() {
  return getContext().destination;
}

export function Analyzer() {
  return getContext().createAnalyser();
}

export function Processor(options, ...targets) {
  [options, targets] = resolveInputs(options, ...targets);

  const node = getContext().createScriptProcessor(4096);
  if (options.onAudioProcess) {
    node.onaudioprocess = options.onAudioProcess;
  }
  return connect(node, ...targets);
}

export function Gain(options, ...targets) {
  [options, targets] = resolveInputs(options, ...targets);

  const node = getContext().createGain();
  node.gain.value = options.value || 1;
  return connect(node, ...targets);
}

export function SourceBuffer(options, ...targets) {
  [options, targets] = resolveInputs(options, ...targets);

  const node = getContext().createBufferSource();
  return connect(node, ...targets);
}

export function Oscillator(options, ...targets) {
  [options, targets] = resolveInputs(options, ...targets);

  const node = getContext().createOscillator();
  node.frequency.value = 3000;
  node.frequency.type = 'sine';
  return connect(node, ...targets);
}
