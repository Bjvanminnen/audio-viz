import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import BufferCanvas from './BufferCanvas';
import { playData } from './utils/webAudio';
import CursorInfo from './CursorInfo';
import { updateCursor } from './redux/cursor';

const styles = {
  canvas: {
    border: '1px solid black',
    backgroundColor: 'black'
  },
  input: {
    width: 80
  },
  button: {
    margin: 5
  }
};

function isFullScreen() {
  return window.innerHeight === screen.height;
}

class BufferCanvasController extends Component {
  static propTypes = {
    //redux
    playStreamId: PropTypes.string,
    playStream: PropTypes.instanceOf(Float32Array),
    maxStreamLength: PropTypes.number.isRequired
  }

  constructor(props) {
    super(props);

    this.state = {
      offset: 0,
      sourceNode: null
    };

    this.moveOffset = this.moveOffset.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onFocusOffset = this.onFocusOffset.bind(this);
    this.onBlurOffset = this.onBlurOffset.bind(this);
    this.play = this.play.bind(this);
    this.stop = this.stop.bind(this);
    this.reset = this.reset.bind(this);
  }

  componentDidMount() {
    // TODO: removeEventListener
    document.addEventListener('keydown', this.onKeyDown.bind(this));
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.offset !== this.state.offset) {
      this.refs.offset.value = this.state.offset.toLocaleString();
    }
  }

  moveOffset(delta) {
    this.setState({
      offset: this.state.offset + delta
    });
  }

  onKeyDown(event) {
    if (event.keyCode === 37) {
      this.moveOffset(event.ctrlKey ? -10000 : -10);
    }
    if (event.keyCode === 39) {
      this.moveOffset(event.ctrlKey ? 10000 : 10);
    }
    // space
    if (event.keyCode === 32) {
      this.play();
    }
  }

  onBlurOffset(event) {
    this.refs.offset.setAttribute('type', undefined);
    this.setState({offset: parseInt(event.target.value, 10) });
  }

  onFocusOffset() {
    this.refs.offset.value = this.state.offset;
    this.refs.offset.setAttribute('type', 'number');
  }

  play() {
    // if we're already playing, eject
    if (this.state.sourceNode) {
      return;
    }

    const { playStream } = this.props;
    if (!playStream) {
      return;
    }

    const sourceNode = playData(playStream.subarray(this.state.offset));
    const audioContext = sourceNode.context;
    const startTime = audioContext.currentTime;
    const originalOffset = this.state.offset;

    this.setState({sourceNode});

    const startDate = new Date();
    let numUpdates = 0;
    const interval = 1000 / (audioContext.sampleRate / this.props.width);
    this.offsetUpdater = window.setInterval(() => {
      const now = audioContext.currentTime;
      const amountPlayed = (now - startTime) * audioContext.sampleRate;
      this.setState({
        offset: originalOffset + Math.round(amountPlayed)
      });

      numUpdates++;
      const dateDelta = (new Date() - startDate) / 1000;
      const fps = numUpdates / dateDelta;
      this.refs.fps.innerHTML = fps;
    }, interval);
  }

  stop() {
    this.state.sourceNode.stop();
    this.setState({sourceNode: null});
    window.clearInterval(this.offsetUpdater);
  }

  reset() {
    this.stop();
    this.setState({
      offset: 0
    });
  }

  render() {
    const { playStreamId, maxStreamLength, updateCursor } = this.props;
    const { offset, sourceNode } = this.state;

    const width = isFullScreen() ? screen.width - 8 : 1800;
    const height = isFullScreen() ? screen.height - 6 : 500;

    return (
      <div>
        <BufferCanvas
          height={height}
          width={width}
          offset={offset}
          step={1}
          logCursorChange={updateCursor}
        />
        {!isFullScreen() &&
          <div>
            <div>
              <span>Offset: </span>
              <input
                ref="offset"
                style={styles.input}
                defaultValue={offset}
                onFocus={this.onFocusOffset}
                onBlur={this.onBlurOffset}
              />
              <span> of {maxStreamLength.toLocaleString()}</span>
              <button
                onClick={this.reset}
                style={styles.button}
              >
                Reset
              </button>
            </div>
            <button
              style={styles.button}
              disabled={sourceNode || !playStreamId}
              onClick={this.play}
            >
              Play {playStreamId}
            </button>
            <button
              style={styles.button}
              disabled={!sourceNode}
              onClick={this.stop}
            >
              Stop
            </button>
            <div ref="fps" style={{display: 'none'}}>0</div>
            <CursorInfo/>
          </div>
        }
      </div>
    );
  }
};

export default connect(({dataStreams}) => ({
  maxStreamLength: dataStreams.maxLength,
  playStream: dataStreams.streams.get(dataStreams.playStreamId),
  playStreamId: dataStreams.playStreamId
}), dispatch => ({
  updateCursor(offset, val) {
    dispatch(updateCursor(offset, val));
  }
}))(BufferCanvasController);
