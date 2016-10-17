import React, { Component, PropTypes } from 'react';
import createOscillatorStream from './createOscillatorStream';
import ControlsBox from './ControlsBox';

const styles = {
  button: {
    margin: 5
  }
};

class OscillatorControls extends Component {
  static propTypes = {
    frequency: PropTypes.number.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      playing: false,
      stream: null
    };

    this.play = this.play.bind(this);
    this.mute = this.mute.bind(this);
  }

  componentDidMount() {
    this.setState({
      stream: createOscillatorStream(this.props.frequency)
    });
  }

  play() {
    this.state.stream.start();
    this.setState({playing: true});
  }

  mute() {
    this.state.stream.mute();
  }

  render() {
    const { playing, stream } = this.state;
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
          Mute
        </button>
      </ControlsBox>
    );
  }
};
export default OscillatorControls;
