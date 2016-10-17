import Grapher from './grapher';

export default function createGraphProcessor(...args) {
  const graphers = args.map(({id, color}) => (
    new Grapher(document.getElementById(id), { style: color })
  ));

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

      if (channel < graphers.length) {
        graphers[channel].drawLine();
        graphers[channel].graph(output);
      }
    }
  };
}
