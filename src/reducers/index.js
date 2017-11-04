import { combineReducers } from 'redux';
import LoginReducer from './LoginReducer';
import NotasRecReducer from './NotasRecReducer';
import NotasReducer from './NotasReducer';

export default combineReducers({
  login: LoginReducer,
  notasRec: NotasRecReducer,
  notas: NotasReducer
});
