import Immutable from 'immutable';

const ADD_STREAM = 'dataStreams/ADD_STREAM';
export const addStream = (streamId, stream) => ({
  type: ADD_STREAM,
  streamId,
  stream
});

const SET_PLAY_STREAM = 'dataStreams/SET_PLAY_STREAM';
export const setPlayStream = (streamId) => ({
  type: SET_PLAY_STREAM,
  streamId
});

const DataStreamRecord = Immutable.Record({
  playStreamId: null,
  streams: Immutable.Map()
});
const initialState = new DataStreamRecord();

export default function dataStreams(state = initialState, action) {
  const { type } = action;

  if (type === ADD_STREAM) {
    const { streamId, stream } = action;
    if (!streamId) {
      throw new Error('require streamId');
    }

    if (state.streams.get(streamId)) {
      throw new Error('stream already exists');
    }

    return state.setIn(['streams', streamId], stream);
  }
  return state;
}
