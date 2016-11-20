import React from 'react';
import { connect } from 'react-redux';

const CursorInfo = ({offset, val}) => (
  <div>
    {/* TODO - could make this display all streams */ }
    <span>{offset.toLocaleString()}</span>
    <span> </span>
    <span>{val}</span>
  </div>
);
export default connect(state => state.cursor)(CursorInfo);
