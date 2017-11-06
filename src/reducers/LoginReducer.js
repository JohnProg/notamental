import {
  EMAIL_CHANGED,
  PASSWORD_CHANGED,
  LOADING_USER,
  LOGIN_USER_SUCCESS,
  LOGIN_USER_FAIL,
  USER_ALREADY_LOGGED,
  USER_LOGGOUT
} from '../actions/types';

const INITIAL_STATE = {
  email: '',
  password: '',
  user: null,
  loading: false,
  err: ''
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case EMAIL_CHANGED:
      return { ...state, email: action.payload };
    case PASSWORD_CHANGED:
      return { ...state, password: action.payload };
    case LOADING_USER:
      return { ...state, loading: true, err: '' };
    case LOGIN_USER_SUCCESS:
      return { ...state, ...INITIAL_STATE, user: action.payload };
    case LOGIN_USER_FAIL:
      return { ...state, err: action.payload, password: '', loading: false };
    case USER_ALREADY_LOGGED:
      return { ...state, user: action.payload };
    case USER_LOGGOUT:
      return { ...state, loading: false, err: '' };
    default:
      return state;
  }
};
