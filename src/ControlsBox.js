import React, { Component, PropTypes } from 'react';

const styles = {
  container: {
    border: '1px solid black',
    display: 'inline-block',
    margin: 2,
    padding: 2,
    maxWidth: 200
  },
  close: {
    display: 'inline-block',
    // border: '1px solid red',
    fontFamily: 'sans-serif',
    paddingLeft: 2,
    paddingRight: 2,
    marginLeft: 2,
    color: 'red',
    backgroundColor: 'darkred'
  }
};

class ControlsBox extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    children: PropTypes.arrayOf(PropTypes.element)
  }

  constructor(props) {
    super(props);

    this.hide = this.hide.bind(this);

    this.state = {
      hidden: false
    };
  }

  hide() {
    this.setState({hidden: true});
  }

  render() {
    const { title, children } = this.props;
    const { hidden } = this.state;
    const style = {
      ...styles.container,
      display: hidden ? 'none' : styles.container.display
    };
    return (
      <div style={style}>
        <div>
          {title}
          <div style={styles.close} onClick={this.hide}>x</div>
        </div>

        {children}
      </div>
    );
  }
}

export default ControlsBox;
