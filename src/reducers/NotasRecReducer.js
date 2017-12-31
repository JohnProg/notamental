import {
  NOTA_CHANGED,
  CREATE_NOTA,
  VOICE_START,
  VOICE_END,
  SAVE_NOTA,
  DELETE_NOTA,
  EDIT_NOTA,
  RESET_NOTA,
  NOTA_INIT,
  INVITE_NOTA
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
    focused: false,
    category: { key: 'archive', label: 'Varios' }
  },
  error: '',
  recording: false
};

export default (state = INITIAL_STATE, action) => {
  console.log(action);
  switch (action.type) {
    case NOTA_CHANGED: {
      return {
        ...state,
        error: '',
        nota: { ...state.nota, [action.payload.prop]: action.payload.value }
      };
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
          members: '',
          focused: false,
          category: { key: 'archive', label: 'Varios' }
        },
        error: '',
        recording: false
      };
    case CREATE_NOTA:
      return INITIAL_STATE;
    case SAVE_NOTA:
      return { ...INITIAL_STATE, error: action.payload };
    case DELETE_NOTA:
      return INITIAL_STATE;
    case INVITE_NOTA:
      return { ...state, error: action.payload };
    case EDIT_NOTA: {
      return { ...state, nota: action.payload };
    }
    case NOTA_INIT:
      return { ...state, nota: action.payload };
    case VOICE_START:
      return { ...state, recording: true };
    case VOICE_END:
      return { ...state, recording: false };
    default:
      return state;
  }
};
