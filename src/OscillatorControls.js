/*eslint-disable no-useless-escape */

import React, { Component, PropTypes } from 'react';
import createOscillatorStream from './utils/createOscillatorStream';
import ControlsBox from './ControlsBox';

const styles = {
  button: {
    margin: 5
  },
  input: {
    width: 10
  },
  volumeButton: {
    display: 'inline-block'
  }
};

class OscillatorControls extends Component {
  static propTypes = {
    frequency: PropTypes.number.isRequired,
    color: PropTypes.string,
  };

  constructor(props) {
    super(props);

    this.state = {
      playing: false,
      stream: null,
      volume: 1
    };

    this.play = this.play.bind(this);
    this.mute = this.mute.bind(this);
    this.volumeUp = this.volumeUp.bind(this);
    this.volumeDown = this.volumeDown.bind(this);
  }

  componentDidMount() {
    this.setState({
      stream: createOscillatorStream({
        frequency: this.props.frequency,
        color: this.props.color || 'red'
      })
    });
  }

  play() {
    this.state.stream.start();
    this.setState({playing: true});
  }

  mute() {
    const newVolume = this.state.volume === 0 ? 1 : 0;
    this.state.stream.setVolume(newVolume);
    this.setState({volume: newVolume});
  }

  volumeUp() {
    const newVolume = this.state.stream.adjustVolume(0.25);
    this.setState({volume: newVolume});
  }

  volumeDown() {
    const newVolume = this.state.stream.adjustVolume(-0.25);
    this.setState({volume: newVolume});
  }

  render() {
    const { playing, stream, volume } = this.state;
    const { frequency } = this.props;
    return (
      <ControlsBox title={`Oscillator ${frequency}hz`}>
        <button
          disabled={playing || !stream}
          onClick={this.play}
          style={styles.button}
        >
          Play
        </button>
        <button
          onClick={this.mute}
          style={styles.button}
        >
          {volume === 0 ? 'Unmute' : 'Mute'}
        </button>
        <div>
          Volume:
          <button onClick={this.volumeUp}>/\</button>
          <span>{volume}</span>
          <button onClick={this.volumeDown}>\/</button>
        </div>
      </ControlsBox>
    );
  }
};
export default OscillatorControls;
