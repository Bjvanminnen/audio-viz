import React, { Component } from 'react';
import { getFile } from './audioGraph';

const styles = {
  canvas: {
    border: '1px solid black'
  }
};

class App extends Component {
  constructor(props) {
    super(props);

    this.play = this.play.bind(this);
    this.mute = this.mute.bind(this);

    this.state = {};
  }

  componentDidMount() {
    getFile(process.env.PUBLIC_URL + '/sounds/bloop.wav')
    .then(file => this.setState({file}));
  }

  play() {
    this.state.file.play();
  }

  mute() {
    this.state.file.mute();
  }

  render() {
    console.log('render');
    return (
      <div>
        <button disabled={!this.state.file} onClick={this.play}>Play</button>
        <button onClick={this.mute}>Mute</button>
        <canvas id="c0" width="1600" height="200" style={styles.canvas}/>
        <canvas id="c1" width="1600" height="200" style={styles.canvas}/>
      </div>
    );
  }
}

export default App;
