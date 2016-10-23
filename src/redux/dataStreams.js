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

const SET_INFO_STREAM = 'dataStreams/SET_INFO_STREAM';
export const setInfoStream = (streamId) => ({
  type: SET_INFO_STREAM,
  streamId
});


const DataStreamRecord = Immutable.Record({
  playStreamId: null,
  infoStreamId: null,
  streamIds: Immutable.List(),
  streams: Immutable.Map(),
  maxLength: 0
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

    const newMaxLength = Math.max(state.maxLength, stream.length);

    return state.merge({
      streamIds: state.streamIds.push(streamId),
      streams: state.streams.set(streamId, stream),
      maxLength: newMaxLength
    });
  }

  if (type === SET_PLAY_STREAM) {
    const { streamId } = action;
    if (!streamId) {
      throw new Error('require streamId');
    }
    return state.set('playStreamId', streamId);
  }

  if (type === SET_INFO_STREAM) {
    const { streamId } = action;
    if (!streamId) {
      throw new Error('require streamId');
    }
    return state.set('infoStreamId', streamId);
  }

  return state;
}
