import React, { Component, PropTypes } from 'react';
import BufferCanvas from './BufferCanvas';

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

class BufferCanvasController extends Component {
  propTypes: {
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    data: PropTypes.array.isRequired
  }

  constructor(props) {
    super(props);

    this.state = {
      offset: 0
    };

    this.right = this.right.bind(this);
    this.left = this.left.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
  }

  componentDidMount() {
    // TODO: removeEventListener
    document.addEventListener('keydown', this.onKeyDown.bind(this));
  }

  left(delta = 10) {
    this.setState({
      offset: this.state.offset - delta
    });
  }

  right(delta = 10) {
    this.setState({
      offset: this.state.offset + delta
    });
  }

  onKeyDown(event) {
    if (event.keyCode === 37) {
      this.left(event.ctrlKey ? 10000 : undefined);
    }
    if (event.keyCode === 39) {
      this.right(event.ctrlKey ? 10000 : undefined);
    }
  }

  render() {
    const { width, height, data } = this.props;
    const { offset } = this.state;
    const buttonStyle = {
      ...styles.button,
      height
    };
    const canvasContainerStyle = {
      ...styles.canvasContainer,
      width,
      height
    };

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
          <BufferCanvas
            height={height}
            width={width}
            offset={offset}
            data={data}/>
        </div>
        <button
          style={buttonStyle}
          onClick={this.right}
        >
          {">"}
        </button>
        <div>
          <span>Offset: </span>
          <span ref="offset">{offset.toLocaleString()}</span>
          <span> of {data.length.toLocaleString()}</span>
        </div>
      </div>
    );
  }
};

export default BufferCanvasController;
