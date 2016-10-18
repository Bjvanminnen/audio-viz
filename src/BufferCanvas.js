import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

const styles = {
  canvas: {
    border: '1px solid black',
    backgroundColor: 'black'
  }
};

class BufferCanvas extends Component {
  propTypes: {
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    offset: PropTypes.number.isRequired,
    data: PropTypes.array.isRequired,
  }

  constructor(props) {
    super(props);
    this.context = null;

    this.colors = [
      'blue',
      'orange',
      'yellow',
      // 'green',
      // 'blue',
      // 'indigo',
      // 'violet'
    ];
    this.colorIndex = 0;
  }

  componentDidMount() {
    const canvas = ReactDOM.findDOMNode(this.refs.canvas);
    this.context = canvas.getContext('2d');
    this.drawCanvas();
  }

  shouldComponentUpdate() {
    return false;
  }

  componentWillReceiveProps() {
    this.drawCanvas();
  }

  drawCanvas() {
    const { context } = this;
    const { width, height, offset, data } = this.props;

    const origin = Math.round(height / 2);

    this.colorIndex = [this.colorIndex + 1] % this.colors.length;
    context.strokeStyle = this.colors[this.colorIndex];
    context.lineWidth = 2;

    context.clearRect(0, 0, width, height);
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
