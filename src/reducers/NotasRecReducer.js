import {
  NOTA_CHANGED,
  CREATE_NOTA,
  VOICE_START
} from '../actions/types';

const INITIAL_STATE = {
  text: '',
  title: '',
  error: ''
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case NOTA_CHANGED: {
      return { ...state, [action.payload.prop]: action.payload.value };
    }
    case CREATE_NOTA:
      return INITIAL_STATE;
    case VOICE_START:
      return state;
    default:
      return state;
  }
};
