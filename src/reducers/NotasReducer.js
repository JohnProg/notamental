import _ from 'lodash';
import {
  FETCH_NOTAS,
  INVITE_USER
} from '../actions/types';

const INITIAL_STATE = null;

export default (state = INITIAL_STATE, action) => {
  console.log(action);
  switch (action.type) {
    case FETCH_NOTAS: {
      if (!action.payload.exists()) {
        _.unset(state, action.payload.key);
        if (_.isEmpty(state)) {
          return INITIAL_STATE;
        }
        return state;
      }
      return { ...state, [action.payload.key]: action.payload.val() };
    }
    case INVITE_USER:
      return state;
    default:
      return state;
  }
};
