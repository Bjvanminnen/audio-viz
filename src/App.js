import React, { Component } from 'react';
import { createAudioGraph } from './createAudioGraph';

const styles = {
  canvas: {
    border: '1px solid black'
  }
};

class App extends Component {
  constructor(props) {
    super(props);

    ['play', 'mute', 'playOscillator'].forEach(fn => {
      this[fn] = this[fn].bind(this);
    });

    this.streams = [];
    this.state = {
      audioStream: null
    };
  }

  componentDidMount() {
    createAudioGraph(process.env.PUBLIC_URL + '/sounds/bloop.wav')
    .then(file => {
      this.streams.push(file);
      this.setState({audioStream: file});
    });
  }

  play() {
    this.state.audioStream.play();
  }

  playOscillator() {
    createAudioGraph().then(stream => {
      this.streams.push(stream);
      stream.play();
    });
  }

  mute() {
    this.streams.forEach(stream => stream.mute());
  }

  render() {
    return (
      <div>
        <button
          disabled={!this.state.audioStream}
          onClick={this.play}
        >
          Bloop
        </button>
        <button
          onClick={this.playOscillator}
        >
          Oscillator
        </button>
        <button onClick={this.mute}>Mute</button>
        <canvas id="c0" width="1600" height="200" style={styles.canvas}/>
        <canvas id="c1" width="1600" height="200" style={styles.canvas}/>
      </div>
    );
  }
}

export default App;
