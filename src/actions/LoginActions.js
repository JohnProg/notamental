import firebase from 'react-native-firebase';
import { GoogleSignin } from 'react-native-google-signin';

import { WEB_CLIENT_ID_GOOGLE } from '../../config';
import {
  PROP_CHANGED,
  EMAIL_CHANGED,
  PASSWORD_CHANGED,
  LOADING_USER,
  LOGIN_USER_SUCCESS,
  LOGIN_USER_FAIL,
  USER_ALREADY_LOGGED,
  USER_LOGGOUT
} from './types';

export const propChanged = ({ prop, value }) => {
  return {
    type: PROP_CHANGED,
    payload: { prop, value }
  };
};

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
    if (email && password) {
      dispatch({ type: LOADING_USER });
      firebase.auth().signInWithEmailAndPassword(email, password)
        .then(user => loginUserSuccess(dispatch, user, navigation))
        .catch((err) => {
          if (err.code === 'auth/wrong-password') {
            loginFailed(dispatch, 'Contraseña o Email incorrectos');
          } else {
            loginFailed(dispatch, 'Usuario no existe');
          }
      });
    } else {
      loginFailed(dispatch, 'Email o Password Vacios');
    }
  };
};

export const signUp = ({ email, password, cPassword, navigation }) => {
  return (dispatch) => {
    if (password === cPassword) {
      dispatch({ type: LOADING_USER });
      firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(user => loginUserSuccess(dispatch, user, navigation))
        .catch(err2 => loginFailed(dispatch, err2.message));
    } else {
      loginFailed(dispatch, 'Las Contraseñas no coinciden');
    }
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
        navigation.navigate('auth');
        dispatch({ type: USER_LOGGOUT });
      });
  };
};

export const googleLogin = (navigation) => {
  return (dispatch) => {
    GoogleSignin.hasPlayServices({ autoResolve: true });
    GoogleSignin.configure({
      webClientId: WEB_CLIENT_ID_GOOGLE
    }).then(() => {
        GoogleSignin.hasPlayServices({ autoResolve: true })
          .then(() => {
            GoogleSignin.signIn()
              .then(user => {
                const credential = firebase.auth.GoogleAuthProvider.credential(
                  user.idToken,
                  user.accessToken
                );
                firebase
                  .auth()
                  .signInWithCredential(credential)
                  .then(userL => {
                    loginUserSuccess(dispatch, userL, navigation);
                  })
                  .catch(err => {
                    loginFailed(dispatch, err.msg);
                  });
              })
              .catch(err => {
                loginFailed(dispatch, err);
              })
              .done();
          })
          .catch(err => {
            loginFailed(dispatch, err);
          });
     });
   };
};


const loginUserSuccess = (dispatch, user, navigation) => {
  const ref = firebase.database().ref(`/users/${user.uid}/`);
  ref.set({ email: user.email })
    .then(() => {
      dispatch({
        type: LOGIN_USER_SUCCESS,
        payload: user
      });
      navigation.navigate('main');
    });
};

const loginFailed = (dispatch, err) => {
  dispatch({
    type: LOGIN_USER_FAIL,
    payload: err
  });
};
