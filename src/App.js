import React, { Component } from 'react';
import OscillatorControls from './OscillatorControls';
import SourceBufferControls from './SourceBufferControls';
import SourceBufferCanvas from './SourceBufferCanvas';

const styles = {
  canvas: {
    border: '1px solid black',
    backgroundColor: 'black'
  }
};

const notes = {
  A1: 55,
  A2: 110,
  C4: 261.63,
  D4: 293.66,
  E4: 329.63
};

class App extends Component {
  render() {
    return (
      <div>
        {
        // <OscillatorControls frequency={notes.A2} color='red'/>
        // <OscillatorControls frequency={notes.D4} color='yellow'/>
        // <SourceBufferControls file='bloop.wav' />

        // <SourceBufferControls file='heartbeats.mp3' />
        // <SourceBufferControls file='firstfires.mp3' />
        // <canvas id="c0" width="1600" height="200" style={styles.canvas}/>
        // <canvas id="c1" width="1600" height="200" style={styles.canvas}/>
        }
        <SourceBufferCanvas width={1400} height={200} file='heartbeats.mp3'/>

      </div>
    );
  }
}

export default App;
