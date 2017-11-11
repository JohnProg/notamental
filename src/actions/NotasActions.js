import firebase from 'react-native-firebase';
import Voice from 'react-native-voice';
import {
  NOTA_CHANGED,
  CREATE_NOTA,
  SAVE_NOTA,
  DELETE_NOTA,
  FETCH_NOTAS,
  VOICE_START,
  VOICE_END,
  VOICE_INIT,
  RESET_NOTA
} from './types';

let record = false;

export const resetNota = () => {
  if (record) {
    Voice.destroy()
      .then(Voice.removeAllListeners);
  }
  return { type: RESET_NOTA };
};

export const notaChanged = ({ prop, value }) => ({
    type: NOTA_CHANGED,
    payload: { prop, value }
});


export const saveNota = ({ title, text, navigation, uid }) => {
  const { currentUser } = firebase.auth();
  return (dispatch) => {
    if (uid) {
      firebase.database().ref(`/users/${currentUser.uid}/notas/${uid}`).set({
        title,
        text,
        timestamp: new Date()
      }).then(() => {
          dispatch({ type: SAVE_NOTA });
          navigation.goBack();
      });
    } else {
      firebase.database().ref(`/users/${currentUser.uid}/notas`).push({
        title,
        text,
        timestamp: new Date()
      }).then(() => {
          dispatch({ type: CREATE_NOTA });
          navigation.goBack();
      });
    }
  };
};

export const deleteNota = ({ uid, navigation }) => {
  const { currentUser } = firebase.auth();
  return (dispatch) => {
    firebase.database().ref(`/users/${currentUser.uid}/notas/${uid}`).remove()
      .then(() => {
        dispatch({ type: DELETE_NOTA });
        if (navigation.state.routeName === 'rec') {
          navigation.goBack();
        }
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

export const initRec = (onResults, onEnding) => {
  return (dispatch) => {
    Voice.onSpeechStart = onSpeechStart.bind(this);
    // Voice.onSpeechRecognized = this.onSpeechRecognized.bind(this);
    Voice.onSpeechEnd = onEnding.bind(this);
    Voice.onSpeechError = onSpeechError.bind(this);
    // Voice.onSpeechResults = this.onSpeechResults.bind(this);
    Voice.onSpeechPartialResults = onResults.bind(this);
    // Voice.onSpeechVolumeChanged = this.onSpeechVolumeChanged.bind(this);
    dispatch({ type: VOICE_INIT });
  };
};

export const startRecognizing = () => {
  return (dispatch) => {
    Voice.start('es-ES')
      .then(() => {
        dispatch({
          type: VOICE_START,
          payload: true
        });
      }).catch((e) => {
        dispatch({
          type: VOICE_START,
          payload: false
        });
        notaChanged({ prop: 'error', value: e.error.message });
      });
  };
};

export const recordEnd = () => ({ type: VOICE_END });

const onSpeechStart = () => {
  record = true;
};

const onSpeechError = (e) => {
  notaChanged({ prop: 'error', value: e.error.message });
};

// const onSpeechPartialResults = (e) => {
//   return (dispatch) => {
//       dispatch({
//         type: NOTA_CHANGED,
//         payload: { prop: 'text', value: e.value }
//       });
//     };
//   // return e.value.map(value => this.notaChanged({ prop: 'text', value }));
// };
