import {
  NOTA_CHANGED,
  CREATE_NOTA,
  VOICE_START,
  VOICE_END,
  SAVE_NOTA,
  DELETE_NOTA,
  RESET_NOTA
} from '../actions/types';

const INITIAL_STATE = {
  text: [],
  title: '',
  uid: '',
  error: '',
  recording: false
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case NOTA_CHANGED:
      return { ...state, [action.payload.prop]: action.payload.value };
    case RESET_NOTA:
      return INITIAL_STATE;
    case CREATE_NOTA:
      return INITIAL_STATE;
    case SAVE_NOTA:
      return INITIAL_STATE;
    // case DELETE_NOTA:
    //   return INITIAL_STATE;
    case VOICE_START:
      return { ...state, recording: action.payload };
    case VOICE_END:
      return { ...state, recording: false };
    default:
      return state;
  }
};
