import React, { Component, PropTypes } from 'react';
import BufferCanvas from './BufferCanvas';
import { playData } from './webAudio';

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
  propTypes: {
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    data: PropTypes.array.isRequired,
    fullScreenMode: PropTypes.bool.isRequired
  }

  constructor(props) {
    super(props);

    this.state = {
      offset: 1000000,
      source: null,
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
    this.setState({offset: parseInt(event.target.value) });
  }

  onFocusOffset() {
    this.refs.offset.value = this.state.offset;
    this.refs.offset.setAttribute('type', 'number');
  }

  play() {
    if (this.state.source) {
      return;
    }
    const source = playData(this.props.data.subarray(this.state.offset));
    const audioContext = source.context;
    const startTime = audioContext.currentTime;
    const originalOffset = this.state.offset;

    this.setState({source});

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
    this.state.source.stop();
    this.setState({source: null});
    window.clearInterval(this.offsetUpdater);
  }

  logCursorChange(offset, val) {
    this.setState({
      cursor: { offset, val }
    });
  }

  render() {
    const { width, height, data, fullScreenMode } = this.props;
    const { offset, source } = this.state;

    return (
      <div>
        <BufferCanvas
          height={height}
          width={width}
          offset={offset}
          data={data}
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
              <span> of {data.length.toLocaleString()}</span>
            </div>
            <button
              style={styles.button}
              disabled={!!source}
              onClick={this.play}
            >
              Play
            </button>
            <button
              style={styles.button}
              disabled={!source}
              onClick={this.stop}
            >
              Stop
            </button>
            <div ref="fps">0</div>
            <div>
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

export default BufferCanvasController;
