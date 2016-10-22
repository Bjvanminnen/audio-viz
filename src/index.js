import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';

import { Provider } from 'react-redux';
import getStore from './redux/getStore';
import { loadBuffer } from './utils/webAudio';
import { addStream } from './redux/dataStreams';

function addFile(filename) {
  const filepath = process.env.PUBLIC_URL + '/sounds/' + filename;
  loadBuffer(filepath).then(buffer => {
    const data = buffer.getChannelData(0);
    getStore().dispatch(addStream('filename', data));
  });
}

addFile('bloop.wav');

ReactDOM.render(
  <Provider store={getStore()}>
    <App />
  </Provider>,
  document.getElementById('root')
);
