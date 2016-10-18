import React, { Component, PropTypes } from 'react';
import BufferCanvas from './BufferCanvas';

const styles = {
  canvas: {
    border: '1px solid black',
    backgroundColor: 'black'
  },
  input: {
    width: 80
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

    this.moveOffset = this.moveOffset.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onFocusOffset = this.onFocusOffset.bind(this);
    this.onBlurOffset = this.onBlurOffset.bind(this);
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
  }

  onBlurOffset(event) {
    this.refs.offset.setAttribute('type', undefined);
    this.setState({offset: parseInt(event.target.value) });
  }

  onFocusOffset() {
    this.refs.offset.value = this.state.offset;
    this.refs.offset.setAttribute('type', 'number');
  }

  render() {
    const { width, height, data } = this.props;
    const { offset } = this.state;

    return (
      <div>
        <BufferCanvas
          height={height}
          width={width}
          offset={offset}
          data={data}/>
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
      </div>
    );
  }
};

export default BufferCanvasController;
