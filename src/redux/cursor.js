const UPDATE_CURSOR = 'cursor/UPDATE_CURSOR';

const initialState = {
  offset: 0,
  val: 0
};
export default function reducer(state = initialState, action) {
  if (action.type === UPDATE_CURSOR) {
    return {
      offset: action.offset,
      val: action.val
    }
  }

  return state;
}

export const updateCursor = (offset, val) => (
  { type: UPDATE_CURSOR, offset, val, logLevel: 'verbose' });
