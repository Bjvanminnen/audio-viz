export default function DSP(buffer, sampleRate=4410) {
  const N = buffer.length - 1;
  let reals = new Float32Array(N);
  let imaginaries = new Float32Array(N);
  let powers = new Float32Array(N);

  const bandSize = Math.PI * 2 / N;

  let maxPower = 0;
  for (let k = 0; k < N; k++) {
    const band = bandSize * k;

    reals[k] = 0;
    imaginaries[k] = 0;
    powers[k] = 0;
    for (let i = 0; i < buffer.length; i++) {
      reals[k] += buffer[i] * Math.cos(i * band);
      imaginaries[k] -= buffer[i] * Math.sin(i * band);
    }
    powers[k] = (reals[k] * reals[k] + imaginaries[k] * imaginaries[k]);
    if (powers[k] > maxPower) {
      maxPower = powers[k];
    }
  }

  // Normalize to max 1
  for (let i = 0; i < powers.length; i++) {
    powers[i] /= maxPower;
  }
  console.log(maxPower);

  return powers;
}
