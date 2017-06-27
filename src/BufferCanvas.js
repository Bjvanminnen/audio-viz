import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Immutable from 'immutable';

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
    logCursorChange: PropTypes.func,

    //redux
    streamIds: PropTypes.instanceOf(Immutable.List).isRequired,
    streams: PropTypes.instanceOf(Immutable.Map).isRequired,
    infoStreamId: PropTypes.string
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

  /**
   * @returns {number} x position on canvas to start drawing data at so that 0
   *   is at half width
   */
  getLeftOffset() {
    const { width, offset, step } = this.props;
    return offset - step * Math.round(width / 2);
  }

  /**
   * @returns {number} y position on canvas of origin
   */
  getOriginY() {
    const { height } = this.props;
    return Math.round(height / 2);
  }

  drawCanvas(updateColor = true) {
    const { context } = this;
    const { width, height, step, streamIds, streams } = this.props;

    // TODO: Might want this configurable in redux store somehow?
    const colors = ['white', 'red', 'green', 'yellow'];

    context.clearRect(0, 0, width, height);
    streamIds.forEach((streamId, bufferIndex) => {
      const buffer = streams.get(streamId);

      const leftOffset = this.getLeftOffset();
      const origin = this.getOriginY();

      const color = colors[bufferIndex % colors.length];
      context.strokeStyle = color;
      context.lineWidth = 2;

      context.beginPath();

      for (let x = 0; x < width; x++) {
        const index = leftOffset + x * step;
        if (index >= 0) {
          const val = buffer[index];
          const y = origin - origin * val;
          if (x === 0) {
            context.moveTo(x, y);
          } else {
            context.lineTo(x, y);
          }
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
    const { height, logCursorChange, streams, infoStreamId } = this.props;

    const buffer = streams.get(infoStreamId);
    if (!buffer) {
      return;
    }

    const leftOffset = this.getLeftOffset();
    const xClick = event.clientX - event.target.offsetLeft - 1;
    const index = leftOffset + xClick;
    const originY = this.getOriginY();

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
    context.arc(xClick, originY - originY * buffer[index], 5, 0, 2 * Math.PI);
    context.fill();
    context.stroke();

    // TODO: note this doesn't account for steps
    if (logCursorChange) {
      logCursorChange(index, buffer[index]);
    }
  }

  onMouseOut(event) {
    this.drawCanvas(false);
  }

  render() {
    const { width, height } = this.props;

    return (
      <canvas
        id="c0"
        onMouseMove={this.onMouseMove}
        onMouseOut={this.onMouseOut}
        height={height}
        width={width}
        style={styles.canvas}
        ref='canvas'/>
    );
  }
};

export default connect(state => ({
  infoStreamId: state.dataStreams.infoStreamId,
  streamIds: state.dataStreams.streamIdsToShow,
  streams: state.dataStreams.streams
}))(BufferCanvas);
