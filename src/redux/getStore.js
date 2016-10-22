import { createStore, combineReducers, applyMiddleware } from 'redux';
import createLogger from 'redux-logger';
import dataStreams from './dataStreams';

const reduxLogger = createLogger({
  collapsed: true
});

let store = null;
const reducers = combineReducers({dataStreams});

export default function getStore() {
  if (!store) {
    store = createStore(reducers, applyMiddleware(reduxLogger));
  }
  return store;
}
