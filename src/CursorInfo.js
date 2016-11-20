import React from 'react';

const CursorInfo = ({offset, val}) => (
  <div>
    {/* TODO - could make this display all streams */ }
    <span>{offset.toLocaleString()}</span>
    <span> </span>
    <span>{val}</span>
  </div>
);
export default CursorInfo;
