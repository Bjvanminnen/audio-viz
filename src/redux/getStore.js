import { createStore, combineReducers, applyMiddleware } from 'redux';
import createLogger from 'redux-logger';
import Immutable from 'immutable';
import dataStreams from './dataStreams';
import cursor from './cursor';

const reduxLogger = createLogger({
  collapsed: true,
  // convert immutable.js objects to JS for logging (code copied from
  // redux-logger readme)
  stateTransformer: (state) => {
    let newState = {};

    for (var i of Object.keys(state)) {
      if (Immutable.Iterable.isIterable(state[i])) {
        newState[i] = state[i].toJS();
      } else {
        newState[i] = state[i];
      }
    }

    return newState;
  },
  predicate: (getState, action) => !(/^cursor\//.test(action.type))
});

let store = null;
const reducers = combineReducers({dataStreams, cursor});

export default function getStore() {
  if (!store) {
    store = createStore(reducers, applyMiddleware(reduxLogger));
  }
  return store;
}
