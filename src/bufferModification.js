/*eslint-disable no-unused-vars */

export function bufferMod1(data) {
  if (!data instanceof Float32Array) {
    throw new Error('expected Float32Array');
  }

  // return linearDesampled(data, 12);
  // return desample(data, 12);
  // return identity(data);
  // return maxAmplitude(data, 0.2);
  // return minAmplitude(data, 0.02);
  // return hideRange(data, -0.1, 0.1);
  // return hideWindowedRange(data, -0.2, 0.2, 150);
  // return sin(data, 40);
  // return triangleSin(data, 188);
  // return desample(data, 8);
  // return trisin(data);
  return combine(sin(data, 40), sin(data, 30));
}

function combine(stream1, stream2) {
  if (stream1.length !== stream2.length) {
    // could theoretically just combine for length of smaller
    throw new Error('streams must be the same size');
  }

  let newData = stream1.slice(0);
  for (let i = 0; i < newData.length; i++) {
    newData[i] = (stream1[i] + stream2[i]) / 2;
  }
  return newData;
}

function identity(data) {
  return data;
}

// Only take 1 in every n data points. Fill in remainder with last data point
// taken.
function desample(data, n) {
  let newData = data.slice(0);
  for (let i = 0; i < newData.length; i++) {
    newData[i] = data[i - i % n];
  }
  return newData;
}

function linearDesampled(data, n) {
  let newData = data.slice(0);
  let lastVal = 0;
  let lastIndex = 0;
  for (let i = 0; i < newData.length; i++) {
    let newVal;
    if (i % n === 0) {
      lastVal = data[i];
      lastIndex = i;
      newVal = lastVal;
    } else {
      const nextVal = data[lastIndex + n];
      const slope = (nextVal - lastVal) / n;
      const dx = i - lastIndex;
      newVal = lastVal + slope * dx;
    }
    newData[i] = newVal;
  }
  return newData;
}

// Don't allow the absolute value of anything to be greater than max
function maxAmplitude(data, max) {
  let newData = data.slice(0);
  for (let i = 0; i < newData.length; i++) {
    const val = data[i];
    if (val > 0) {
      newData[i] = Math.min(max, val);
    } else if (val !== 0) {
      newData[i] = Math.max(-max, val);
    }
  }
  return newData;
}

// Don't allow the absolute value of anything to be less than min
function minAmplitude(data, min) {
  let newData = data.slice(0);
  for (let i = 0; i < newData.length; i++) {
    const val = data[i];
    if (val > 0) {
      newData[i] = Math.max(min, val);
    } else {
      newData[i] = Math.min(-min, val);
    }
  }
  return newData;
}

// Anything in range (start, end) gets turned into 0
function hideRange(data, start, end) {
  let newData = data.slice(0);
  for (let i = 0; i < newData.length; i++) {
    const val = data[i];
    if (val >= start && val <= end) {
      newData[i] = 0;
    }
  }
  return newData;
}

// Anything in range (start, end) gets turned into 0 if there are no values
// within windowSize / 2 on either side in that range
function hideWindowedRange(data, start, end, windowSize) {
  if (windowSize % 2 !== 0) {
    windowSize++;
  }

  let newData = data.slice(0);
  let outOfRangeCount = 0;
  for (let i = 0; i < newData.length; i++) {
    const val = data[i];
    if (val >= start && val <= end) {
      outOfRangeCount++;
      if (outOfRangeCount > windowSize) {
        newData[i - windowSize / 2] = 0;
      }
    } else {
      outOfRangeCount = 0;
    }
  }
  return newData;
}

function sin(data, divisor = 30) {
  let newData = data.slice(0);
  for (let i = 0; i < newData.length; i++) {
    newData[i] = Math.sin(i / divisor);
  }
  return newData;
}

function halfSinLifted(data) {
  let newData = data.slice(0);
  for (let i = 0; i < newData.length; i++) {
    newData[i] = Math.sin(i / 30) / 4 + 0.000001 * i;
  }
  return newData;
}

function triangleSin(data, wavelength) {
  let newData = data.slice(0);
  if (wavelength % 4 !== 0) {
    throw new Error('require wavelength divisible by 4');
  }
  const quarterWave = wavelength / 4;
  const slope = 1 / quarterWave;

  for (let i = 0; i < newData.length; i++) {
    const wavePos = i % wavelength;
    let val;
    if (wavePos < 2 * quarterWave) {
      val = 1 - wavePos * slope;
    } else {
      val = -1 + (wavePos - 2 * quarterWave) * slope;
    }
    newData[i] = val;
  }
  return newData;
}

// Divide graph into sections where we cross 0. Turn each section into a triangle
// where the tip is the max value in that section
function triangularize(data) {
  let newData = data.slice(0);

  let positive = data[0] > 0;
  let sectionStart = 0;
  let sectionMax = 0;

  for (let i = 0; i < newData.length; i++) {
    const thisPositive = data[i] > 0;
    if (thisPositive !== positive) {
      // Crossed 0, do our thing
      const slopeIn = (data[sectionMax] - data[sectionStart]) /
        (sectionMax - sectionStart);
      for (let j = sectionStart; j <= sectionMax; j++) {
        newData[j] = slopeIn * (j - sectionStart);
      }
      const slopeOut = -data[sectionMax] / (i - sectionMax);
      for (let j = sectionMax + 1; j < i; j++) {
        newData[j] = data[sectionMax] + slopeOut * (j - sectionMax);
      }

      sectionStart = i;
      sectionMax = sectionStart;
      positive = !positive;
    } else {
      if (Math.abs(data[i]) > Math.abs(data[sectionMax])) {
        sectionMax = i;
      }
    }
  }
  return newData;
}

const sinCurve = (startVal, endVal, width) => {
  let curve = [];
  let quartile;
  let offsetY;
  const positive = (startVal + endVal) > 0;
  if (positive) {
    if (endVal > startVal) {
      quartile = 0;
      offsetY = startVal;
    } else {
      quartile = 1;
      offsetY = endVal;
    }
  } else {
    if (endVal < startVal) {
      quartile = 2;
      offsetY = startVal;
    } else {
      quartile = 3;
      offsetY = endVal;
    }
  }

  const amplitude = Math.abs(endVal - startVal);
  for (let i = 0; i < width; i++) {
    curve.push(offsetY +
      Math.sin((i / width + quartile) * Math.PI / 2) * amplitude);
  }
  return curve;
}

// Same as triangle, but try to draw curves instead of triangles using sin
function trisin(data) {
  let newData = data.slice(0);

  let positive = data[0] > 0;
  let sectionStart = 0;
  let sectionMax = 0;

  for (let i = 0; i < newData.length; i++) {
    const thisPositive = data[i] > 0;
    if (thisPositive !== positive) {
      const curve = sinCurve(data[sectionStart], data[sectionMax],
        sectionMax - sectionStart);
      for (let j = 0; j < curve.length; j++) {
        newData[sectionStart + j] = curve[j];
      }
      const curve2 = sinCurve(data[sectionMax], data[i], i - sectionMax);
      for (let j = 0; j < curve2.length; j++) {
        newData[sectionMax + j] = curve2[j];
      }
      sectionStart = i;
      sectionMax = sectionStart;
      positive = !positive;
    } else {
      if (Math.abs(data[i]) > Math.abs(data[sectionMax])) {
        sectionMax = i;
      }
    }
  }
  return newData;
}
