import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

const styles = {
  canvas: {
    border: '1px solid black',
    backgroundColor: 'black'
  },
  button: {
    // display: 'inline-block',
    display: 'none',
    position: 'absolute',
    top: 0
  },
  // hack bc i'm struggling to get buttons to look right otherwise
  canvasContainer: {
    display: 'inline-block',
    marginLeft: 24
  }
};

class BufferCanvas extends Component {
  propTypes: {
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    data: PropTypes.array.isRequired
  }

  constructor(props) {
    super(props);

    this.offset = 0;
    this.windowSize = 4096;
    this.context = null;

    this.right = this.right.bind(this);
    this.left = this.left.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
  }

  componentDidMount() {
    const canvas = ReactDOM.findDOMNode(this.refs.canvas);
    this.context = canvas.getContext('2d');
    this.drawCanvas();

    document.addEventListener('keydown', this.onKeyDown.bind(this));
  }

  shouldComponentUpdate() {
    console.error('attempting to update');
    return false;
  }

  left(delta = 10) {
    this.offset -= delta;
    this.drawCanvas();
  }

  right(delta = 10) {
    this.offset += delta;
    this.drawCanvas();
  }

  onKeyDown(event) {
    if (event.keyCode === 37) {
      this.left(event.ctrlKey ? 10000 : undefined);
    }
    if (event.keyCode === 39) {
      this.right(event.ctrlKey ? 10000 : undefined);
    }
  }

  drawCanvas() {
    ReactDOM.findDOMNode(this.refs.offset).innerHTML = this.offset.toLocaleString();
    const { context, windowSize, offset } = this;
    const { width, height, data } = this.props;

    const origin = Math.round(height / 2);

    context.clearRect(0, 0, width, height);
    context.strokeStyle = 'yellow';
    context.beginPath();
    context.moveTo(0, origin);
    for (let x = 0; x < width; x++) {
      const val = data[offset + x];
      const y = origin - origin * val;
      context.lineTo(x, y);
    }
    context.stroke();
  }

  render() {
    const { width, height, data } = this.props;
    const buttonStyle = {
      ...styles.button,
      height
    };
    const canvasContainerStyle = {
      ...styles.canvasContainer,
      width,
      height
    };

    // TODO - eventually separate canvas from stuff that can re-render
    return (
      <div>
        <button
          style={buttonStyle}
          onClick={this.left}
        >
          {"<"}
        </button>
        <div
          style={canvasContainerStyle}
        >
          <canvas
            height={height}
            width={width}
            style={styles.canvas}
            ref='canvas'/>
        </div>
        <button
          style={buttonStyle}
          onClick={this.right}
        >
          {">"}
        </button>
        <div>
          <span>Offset: </span>
          <span ref="offset">0</span>
          <span> of {data.length.toLocaleString()}</span>
        </div>
      </div>
    );
  }
};

export default BufferCanvas;
