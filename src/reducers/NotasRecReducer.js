import {
  NOTA_CHANGED,
  CREATE_NOTA
} from '../actions/types';

const INITIAL_STATE = {
  text: '',
  title: '',
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case NOTA_CHANGED: {
      return { ...state, [action.payload.prop]: action.payload.value };
    }
    case CREATE_NOTA:
      return INITIAL_STATE;
    default:
      return state;
  }
};
