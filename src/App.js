/*eslint-disable no-unused-vars */

import React, { Component } from 'react';
// import OscillatorControls from './OscillatorControls';
// import SourceBufferControls from './SourceBufferControls';
import BufferCanvasController from './BufferCanvasController';

const styles = {
  canvas: {
    border: '1px solid black',
    backgroundColor: 'black'
  }
};

function isFullScreen() {
  return window.innerHeight === screen.height;
}

class App extends Component {
  render() {
    const width = isFullScreen() ? screen.width - 8 : 1800;
    const height = isFullScreen() ? screen.height - 6 : 500;
    return (
      <div>
        {
        //
        // <OscillatorControls frequency={notes.A2} color='blue'/>
        // <OscillatorControls frequency={notes.D4} color='yellow'/>
        // <SourceBufferControls file='bloop.wav' />

        // <SourceBufferControls file='heartbeats.mp3' />
        // <SourceBufferControls file='firstfires.mp3' />
        // <canvas id="c0" width="1600" height="200" style={styles.canvas}/>
        // <canvas id="c1" width="1600" height="200" style={styles.canvas}/>
        }
        <BufferCanvasController
          width={width}
          height={height}
          fullScreenMode={isFullScreen()}
        />

      </div>
    );
  }
}

export default App;
