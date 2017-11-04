import {
  FETCH_NOTAS
} from '../actions/types';

const INITIAL_STATE = {};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case FETCH_NOTAS:
      return action.payload;
    default:
      return state;
  }
};
