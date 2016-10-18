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
    offset: PropTypes.number.isRequired,
    data: PropTypes.array.isRequired
  }

  constructor(props) {
    super(props);
    this.context = null;
  }

  componentDidMount() {
    const canvas = ReactDOM.findDOMNode(this.refs.canvas);
    this.context = canvas.getContext('2d');
    this.drawCanvas();
  }

  componentDidUpdate() {
    this.drawCanvas();
  }

  drawCanvas() {
    const { context } = this;
    const { width, height, offset, data } = this.props;

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
    const { width, height } = this.props;

    return (
      <canvas
        height={height}
        width={width}
        style={styles.canvas}
        ref='canvas'/>
    );
  }
};

export default BufferCanvas;
