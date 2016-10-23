import React, { Component, PropTypes } from 'react';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import BufferCanvas from './BufferCanvas';
import { playData } from './utils/webAudio';

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

class BufferCanvasController extends Component {
  static propTypes = {
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    fullScreenMode: PropTypes.bool.isRequired,

    //redux
    streamIds: PropTypes.instanceOf(Immutable.List).isRequired,
    streams: PropTypes.instanceOf(Immutable.Map).isRequired,
    playStreamId: PropTypes.string,
    maxStreamLength: PropTypes.number.isRequired
  }

  constructor(props) {
    super(props);

    this.state = {
      offset: 0,
      sourceNode: null,
      cursor: {
        offset: 0,
        val: 0
      }
    };

    this.moveOffset = this.moveOffset.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onFocusOffset = this.onFocusOffset.bind(this);
    this.onBlurOffset = this.onBlurOffset.bind(this);
    this.play = this.play.bind(this);
    this.stop = this.stop.bind(this);
    this.reset = this.reset.bind(this);
    this.logCursorChange = this.logCursorChange.bind(this);
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

    const { playStreamId, streams } = this.props;

    const playStream = streams.get(playStreamId);
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

  logCursorChange(offset, val) {
    this.setState({
      cursor: { offset, val }
    });
  }

  render() {
    const { width, height, fullScreenMode, playStreamId, maxStreamLength } = this.props;
    const { offset, sourceNode } = this.state;

    return (
      <div>
        <BufferCanvas
          height={height}
          width={width}
          offset={offset}
          step={1}
          logCursorChange={this.logCursorChange}
        />
        {!fullScreenMode &&
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
            <div>
              {/* TODO - could make this display all streams */ }
              <span>{this.state.cursor.offset.toLocaleString()}</span>
              <span> </span>
              <span>{this.state.cursor.val}</span>
            </div>
          </div>
        }
      </div>
    );
  }
};

export default connect(state => ({
  maxStreamLength: state.dataStreams.maxLength,
  playStreamId: state.dataStreams.playStreamId,
  streamIds: state.dataStreams.streamIds,
  streams: state.dataStreams.streams
}))(BufferCanvasController);
