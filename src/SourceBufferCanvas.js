import React, { Component, PropTypes } from 'react';
import { loadBuffer } from './webAudio';
import BufferCanvasController from './BufferCanvasController';
import { bufferMod1 } from './bufferModification';

/**
 * Wrapper around BufferCanvas that takes a file, loads it into a buffer, then
 * renders a BufferCanvas
 */
class SourceBufferCanvas extends Component {
  static propTypes = {
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    file: PropTypes.string.isRequired,
    fullScreenMode: PropTypes.bool.isRequired
  }

  constructor(props) {
    super(props);

    this.state = {
      data: null
    };
  }

  componentDidMount() {
    const filepath = process.env.PUBLIC_URL + '/sounds/' + this.props.file;
    loadBuffer(filepath).then(buffer => {
      const data = buffer.getChannelData(0);
      this.setState({data});
    });
  }

  render() {
    if (!this.state.data) {
      return <div>Loading...</div>
    }
    const { width, height, fullScreenMode } = this.props;

    return (
      <div>
        <BufferCanvasController
          width={width}
          height={height}
          fullScreenMode={fullScreenMode}
          data={[bufferMod1(this.state.data), this.state.data]}
        />
      </div>
    );
  }
}

export default SourceBufferCanvas;
