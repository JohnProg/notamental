import firebase from 'react-native-firebase';
import {
  NOTA_CHANGED,
  CREATE_NOTA,
  FETCH_NOTAS
} from './types';

export const notaChanged = ({ prop, value }) => ({
    type: NOTA_CHANGED,
    payload: { prop, value }
  });


export const createNota = ({ title, text, navigation }) => {
  const { currentUser } = firebase.auth();
  return (dispatch) => {
    firebase.database().ref(`/users/${currentUser.uid}/notas`).push({
      title,
      text,
      timestamp: new Date()
    }).then(() => {
        dispatch({ type: CREATE_NOTA });
        navigation.goBack();
      });
  };
};

export const fetchNotas = ({ user }) =>
  // const { currentUser } = firebase.auth();
   (dispatch) => {
    firebase.database().ref(`/users/${user.uid}/notas`)
      .on('value', snapshot => {
        dispatch({
          type: FETCH_NOTAS,
          payload: snapshot.val()
        });
      });
  };
