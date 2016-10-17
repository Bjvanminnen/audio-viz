import React, { Component } from 'react';
import OscillatorControls from './OscillatorControls';
import SourceBufferControls from './SourceBufferControls';

const styles = {
  canvas: {
    border: '1px solid black',
    backgroundColor: 'black'
  }
};

class App extends Component {
  render() {
    return (
      <div>
        <OscillatorControls frequency={1000} />
        <SourceBufferControls file='bloop.wav' />
        <SourceBufferControls file='heartbeats.mp3' />
        <SourceBufferControls file='firstfires.mp3' />
        <canvas id="c0" width="1600" height="200" style={styles.canvas}/>
        <canvas id="c1" width="1600" height="200" style={styles.canvas}/>
      </div>
    );
  }
}

export default App;
