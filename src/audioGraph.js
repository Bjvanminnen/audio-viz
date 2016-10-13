var Grapher = require('./grapher');

var context;
function getContext () {
  if (context) {
    return context;
  }

  if (typeof AudioContext !== "undefined") {
    context = new AudioContext();
  } else if (typeof window.webkitAudioContext !== "undefined") {
    context = new window.webkitAudioContext();
  } else {
    throw new Error('AudioContext not supported. :(');
  }

  return context;
}

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
  var graph = {};
  var ctx = graph.context = getContext();
  var nodes = graph.nodes = {};
  var startTime;

  nodes.source = ctx.createBufferSource();
  nodes.gain = ctx.createGain();
  nodes.analyzer = ctx.createAnalyser();
  nodes.processor = ctx.createScriptProcessor(4096);

  graph.start = function () {
    nodes.source.connect(nodes.gain);
    nodes.gain.connect(nodes.processor);
    nodes.processor.connect(nodes.analyzer);
    nodes.processor.connect(ctx.destination);
    startTime = ctx.currentTime;
    nodes.source.start();

    graph.nodes.source.onended = function () {
      setTimeout(function () {
        nodes.processor.onended();
      }, 1000);
    };
  }

  graph.runTime = function () {
    return ctx.currentTime - startTime;
  }

  return graph;
};

function loadBuffer(url, audioContext, callback) {
  var request = new XMLHttpRequest();
  request.open("GET", url, true);
  request.responseType = "arraybuffer";

  // Our asynchronous callback
  request.onload = function() {
    var audioData = request.response;
    audioContext.decodeAudioData(audioData, function (buffer) {
      console.log('decoded: ' + buffer.length);
      callback(buffer);
    });
  };

  request.onerror = function (err) {
    console.log(err);
  };

  request.send();
};

function playFile (file, options) {
  options = options || {};
  var graph = createGraph();
  extendGain(graph.nodes.gain, options);
  extendProcessor(graph.nodes.processor, options);

  loadBuffer(file, graph.context, function (buffer) {
    extendSource(graph.nodes.source, buffer, options);

    graph.start();
  });
};

/**
 * EXTENDERS
 */

function extendSource(node, buffer, options) {
  node.buffer = buffer;
}

function extendGain(node, options) {
  node.gain.value = options.gain || 1;
}

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

module.exports.playFile = playFile;
