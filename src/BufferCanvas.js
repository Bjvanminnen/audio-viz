import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

const STEP = 1;

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
    getColor(updateColor) {
      if (updateColor) {
        green += delta;
        if (green > 255 || green < 0) {
          delta *= -1;
        }
      }
      return `rgb(${red}, ${green}, ${blue})`;
    }
  };
};

/*
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
*/

class BufferCanvas extends Component {
  propTypes: {
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    offset: PropTypes.number.isRequired,
    data: PropTypes.array.isRequired,
    logIndex: PropTypes.func
  }

  constructor(props) {
    super(props);
    this.context = null;

    this.colorTransition = colorTransition();
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseOut = this.onMouseOut.bind(this);
  }

  componentDidMount() {
    const canvas = ReactDOM.findDOMNode(this.refs.canvas);
    this.context = canvas.getContext('2d');
    this.drawCanvas();
  }

  shouldComponentUpdate() {
    return false;
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.offset !== nextProps.offset) {
      this.drawCanvas();
    }
  }

  drawCanvas(updateColor = true) {
    const { context } = this;
    const { width, height, offset, data } = this.props;

    const leftOffset = offset - STEP * Math.round(width / 2);

    const origin = Math.round(height / 2);

    context.strokeStyle = this.colorTransition.getColor(updateColor);;
    context.lineWidth = 2;

    context.clearRect(0, 0, width, height);
    context.beginPath();
    let moveToX = 0;
    if (leftOffset < 0) {
      moveToX = -leftOffset;
    }

    context.moveTo(moveToX, origin);
    for (let x = 0; x < width; x++) {
      const index = leftOffset + x * STEP;
      if (index >= 0) {
        const val = data[index];
        const y = origin - origin * val;
        context.lineTo(x, y);
      }
    }
    context.stroke();

    context.strokeStyle = 'white';
    context.lineWidth = 1;
    context.beginPath();
    context.moveTo(width / 2, 0);
    context.lineTo(width / 2, height);
    context.stroke();
    context.beginPath();
    context.moveTo(0, height / 2);
    context.lineTo(width, height / 2);
    context.stroke();
  }

  onMouseMove(event) {
    const { data, offset, width, height, logCursorChange } = this.props;
    const leftOffset = offset - STEP * Math.round(width / 2);
    const xClick = event.clientX - event.target.offsetLeft - 1;
    const index = leftOffset + xClick;
    const origin = Math.round(height / 2);

    this.drawCanvas(false);

    const { context } = this;
    context.strokeStyle = 'green';
    context.fillStyle = 'green';
    context.lineWidth = 1;
    context.beginPath();
    context.moveTo(xClick, 0);
    context.lineTo(xClick, height);
    context.stroke();
    context.strokeStyle = 'white';
    context.beginPath();
    context.arc(xClick, origin - origin * data[index], 5, 0, 2 * Math.PI);
    context.fill();
    context.stroke();

    if (logCursorChange) {
      logCursorChange(index, data[index]);
    }
  }

  onMouseOut(event) {
    this.drawCanvas(false);
  }

  render() {
    const { width, height } = this.props;

    return (
      <canvas
        onMouseMove={this.onMouseMove}
        onMouseOut={this.onMouseOut}
        height={height}
        width={width}
        style={styles.canvas}
        ref='canvas'/>
    );
  }
};

export default BufferCanvas;
