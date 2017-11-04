import firebase from 'react-native-firebase';
import {
  EMAIL_CHANGED,
  PASSWORD_CHANGED,
  LOADING_USER,
  LOGIN_USER_SUCCESS,
  LOGIN_USER_FAIL,
  USER_ALREADY_LOGGED,
  USER_LOGGOUT
} from './types';

export const emailChanged = (text) => {
  return {
    type: EMAIL_CHANGED,
    payload: text
  };
};

export const passwordChanged = (text) => {
  return {
    type: PASSWORD_CHANGED,
    payload: text
  };
};

export const loginUser = ({ email, password, navigation }) => {
  return (dispatch) => {
    dispatch({ type: LOADING_USER });
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(user => loginUserSuccess(dispatch, user, navigation))
      .catch((err) => {
        if (err.code === 'auth/wrong-password') {
          loginFailed(dispatch, err.message);
        } else {
          firebase.auth().createUserWithEmailAndPassword(email, password)
            .then(user => loginUserSuccess(dispatch, user, navigation))
            .catch(err2 => loginFailed(dispatch, err2.message));
          }
      });
  };
};

export const userLogged = (user) => {
  return {
    type: USER_ALREADY_LOGGED,
    payload: user
  };
};

export const userLoggout = (navigation) => {
  return (dispatch) => {
    dispatch({ type: LOADING_USER });
    firebase.auth().signOut()
      .then(() => {
        dispatch({ type: USER_LOGGOUT });
        navigation.navigate('login');
      });
  };
};


const loginUserSuccess = (dispatch, user, navigation) => {
  dispatch({
    type: LOGIN_USER_SUCCESS,
    payload: user
  });
  navigation.navigate('main');
};

const loginFailed = (dispatch, err) => {
  dispatch({
    type: LOGIN_USER_FAIL,
    payload: err
  });
};
