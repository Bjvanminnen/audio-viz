import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

const styles = {
  main: {
    position: 'absolute',
    height: 50,
    backgroundColor: 'green',
    border: '3px solid black',
    left: 30,
    right: 30
  },
  hidden: {
    display: 'none'
  }
};

class Flasher extends Component {
  static propTypes = {
    streamId: PropTypes.string.isRequired,
    offset: PropTypes.number.isRequired,

    // redux provided
    streams: PropTypes.object.isRequired,
  };

  render() {
    const { streamId, offset, streams } = this.props;

    const buffer = streams.get(streamId);
    if (!buffer) {
      return null;
    }

    const hidden = buffer[offset] !== 1;
    const style = {
      ...styles.main,
      ...(hidden && styles.hidden)
    };
    return (
      <div style={style}/>
    );
  }
}

export default connect(state => ({
  streams: state.dataStreams.streams
}))(Flasher);
