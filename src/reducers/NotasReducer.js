import _ from 'lodash';
import {
  FETCH_NOTAS,
  INVITE_USER,
  DELETE_NOTA
} from '../actions/types';

const INITIAL_STATE = {
  list: null,
  fetching: ''
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case FETCH_NOTAS: {
      if (!action.payload.exists()) {
        _.unset(state, action.payload.key);
        if (_.isEmpty(state)) {
          return { ...INITIAL_STATE, fetching: true };
        }
        return { ...state, fetching: true };
      }
      return {
        ...state,
        fetching: true,
        list: { ...state.list, [action.payload.key]: action.payload.val()
        } };
    }
    case DELETE_NOTA: {
      const { list } = state;
      delete list[action.payload];
      return { ...state, list };
    }
    default:
      return state;
  }
};
