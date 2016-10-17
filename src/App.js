import React, { Component } from 'react';
import { createAudioGraph } from './createAudioGraph';
import OscillatorControls from './OscillatorControls';

const styles = {
  canvas: {
    border: '1px solid black',
    backgroundColor: 'black'
  },
  topButton: {
    margin: 5
  }
};

class App extends Component {
  constructor(props) {
    super(props);

    ['play', 'mute'].forEach(fn => {
      this[fn] = this[fn].bind(this);
    });

    this.file = 'bloop.wav';

    this.streams = [];
    this.oscillator = null;
    this.state = {
      audioStream: null
    };
  }

  componentDidMount() {
    // createAudioGraph(process.env.PUBLIC_URL + '/sounds/sweep_right.mp3')
    createAudioGraph(process.env.PUBLIC_URL + '/sounds/' + this.file)
    .then(file => {
      this.streams.push(file);
      this.setState({audioStream: file});
    });
  }

  play() {
    this.state.audioStream.play();
  }

  mute() {
    this.streams.forEach(stream => stream.adjustVolume(-0.25));
  }

  render() {
    return (
      <div>
        <OscillatorControls />
        <button
          style={styles.topButton}
          disabled={!this.state.audioStream}
          onClick={this.play}
        >
          {this.file}
        </button>
        {
        // <button
        //   style={styles.topButton}
        //   onClick={this.toggleOscillator}
        // >
        //   Oscillator
        // </button>
        }
        <canvas id="c0" width="1600" height="200" style={styles.canvas}/>
        <canvas id="c1" width="1600" height="200" style={styles.canvas}/>
        <button onClick={this.mute}>Mute</button>
      </div>
    );
  }
}

export default App;
