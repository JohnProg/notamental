import {
  NOTA_CHANGED,
  CREATE_NOTA,
  VOICE_START,
  VOICE_END,
  SAVE_NOTA,
  DELETE_NOTA,
  EDIT_NOTA,
  RESET_NOTA,
  NOTA_INIT
} from '../actions/types';

const INITIAL_STATE = {
  nota: {
    text: [{
      val: '',
      style: ''
    }],
    title: '',
    uid: '',
    timestamp: '',
    members: '',
    position: 0,
    focused: ''
  },
  error: '',
  recording: false
};

export default (state = INITIAL_STATE, action) => {
  console.log(action);
  switch (action.type) {
    case NOTA_CHANGED: {
      return { ...state, nota: { ...state.nota, [action.payload.prop]: action.payload.value } };
    }
    case RESET_NOTA:
      return {
        nota: {
          text: [{
            val: '',
            style: ''
          }],
          title: '',
          uid: '',
          timestamp: '',
          members: ''
        },
        error: '',
        recording: false
      };
    case CREATE_NOTA:
      return INITIAL_STATE;
    case SAVE_NOTA:
      return INITIAL_STATE;
    case DELETE_NOTA:
      return INITIAL_STATE;
    // case DELETE_NOTA:
    //   return INITIAL_STATE;
    case EDIT_NOTA: {
      return { ...state, nota: action.payload };
    }
    case NOTA_INIT:
      return { ...state, nota: { ...state.nota, uid: action.payload } };
    case VOICE_START:
      return { ...state, recording: action.payload };
    case VOICE_END:
      return { ...state, recording: false };
    default:
      return state;
  }
};
