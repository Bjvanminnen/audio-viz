import React, { Component } from 'react';
import createSourceBufferStream from './createSourceBufferStream';
import ControlsBox from './ControlsBox';

const styles = {
  button: {
    margin: 5
  }
};

class SourceBufferControls extends Component {
  constructor(props) {
    super(props);

    this.state = {
      playing: false,
      stream: null
    };

    this.play = this.play.bind(this);
    this.mute = this.mute.bind(this);

    const filepath = process.env.PUBLIC_URL + '/sounds/' + props.file;
    createSourceBufferStream(filepath).then(stream => {
      this.setState({stream});
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
    const { file } = this.props;
    return (
      <ControlsBox title={file}>
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
export default SourceBufferControls;
