import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

const styles = {
  canvas: {
    border: '1px solid black',
    backgroundColor: 'black'
  }
};

const colorTransition = () => {
  let red = 255;
  let green = 0;
  let blue = 0;

  let delta = 3;
  return {
    getColor() {
      const nextColor = `rgb(${red}, ${green}, ${blue})`;

      green += delta;
      if (green > 255 || green < 0) {
        delta *= -1;
      }
      return nextColor;
    }
  };
};

const colorTransition2 = () => {
  const colors = [
    'green',
    'orange',
    'yellow',
    // 'green',
    // 'blue',
    // 'indigo',
    // 'violet'
  ];
  let index = 0;
  return {
    getColor() {
      const nextColor = colors[index];
      index = (index + 1) % colors.length;
      return nextColor;
    }
  };
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

    this.colorTransition = colorTransition();
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

    context.strokeStyle = this.colorTransition.getColor();;
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
