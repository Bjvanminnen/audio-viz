import React, { Component } from 'react';

import graph from './audioGraph';

const styles = {
  canvas: {
    border: '1px solid black'
  }
};

class App extends Component {
  play() {
    graph.playFile(process.env.PUBLIC_URL + 'firstfires.mp3');
  }

  render() {
    return (
      <div>
        <button onClick={this.play}>Play</button>
        <canvas id="c0" width="1600" height="200" style={styles.canvas}/>
      </div>
    );
  }
}

export default App;
