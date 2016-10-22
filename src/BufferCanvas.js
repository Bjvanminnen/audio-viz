import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

const styles = {
  canvas: {
    border: '1px solid black',
    backgroundColor: 'black'
  }
};

class BufferCanvas extends Component {
  static propTypes = {
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    offset: PropTypes.number.isRequired,
    step: PropTypes.number.isRequired,
    logCursorChange: PropTypes.func
  }

  constructor(props) {
    super(props);
    this.context = null;

    // this.colorTransition = colorTransition();
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseOut = this.onMouseOut.bind(this);
  }

  componentDidMount() {
    const canvas = this.refs.canvas;
    this.context = canvas.getContext('2d');
    this.drawCanvas();
  }

  shouldComponentUpdate() {
    return false;
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.offset !== nextProps.offset ||
        this.props.streamIds !== nextProps.streamIds) {
      // schedule so that props have been updated by the time it happens
      setTimeout(() => this.drawCanvas(), 0);
    }
  }

  drawCanvas(updateColor = true) {
    const { context } = this;
    const { width, height, offset, step, streamIds, streams } = this.props;


    context.clearRect(0, 0, width, height);
    streamIds.forEach((streamId, bufferIndex) => {
      const buffer = streams.get(streamId);

      const leftOffset = offset - step * Math.round(width / 2);

      const origin = Math.round(height / 2);

      if (bufferIndex === 1) {
        // context.strokeStyle = this.colorTransition.getColor(updateColor);
        context.strokeStyle = 'red';
      } else {
        context.strokeStyle = 'white';
      }
      context.lineWidth = 2;

      context.beginPath();
      let moveToX = 0;
      if (leftOffset < 0) {
        moveToX = -leftOffset;
      }

      context.moveTo(moveToX, origin);
      for (let x = 0; x < width; x++) {
        const index = leftOffset + x * step;
        if (index >= 0) {
          const val = buffer[index];
          const y = origin - origin * val;
          context.lineTo(x, y);
        }
      }
      context.stroke();
    });
    
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
    const { step, data, offset, width, height, logCursorChange } = this.props;
    const leftOffset = offset - step * Math.round(width / 2);
    const xClick = event.clientX - event.target.offsetLeft - 1;
    const index = leftOffset + xClick;
    const origin = Math.round(height / 2);

    const buffer = data[0];

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
    context.arc(xClick, origin - origin * buffer[index], 5, 0, 2 * Math.PI);
    context.fill();
    context.stroke();

    if (logCursorChange) {
      logCursorChange(index, buffer[index]);
    }
  }

  onMouseOut(event) {
    this.drawCanvas(false);
  }

  render() {
    const { width, height } = this.props;

    // onMouseMove={this.onMouseMove}
    // onMouseOut={this.onMouseOut}
    return (
      <canvas

        height={height}
        width={width}
        style={styles.canvas}
        ref='canvas'/>
    );
  }
};

export default connect(state => {
  console.log('connected ');
  return ({
  streamIds: state.dataStreams.streamIds,
  streams: state.dataStreams.streams
})})(BufferCanvas);
