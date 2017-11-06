import firebase from 'react-native-firebase';
import Voice from 'react-native-voice';
import {
  NOTA_CHANGED,
  CREATE_NOTA,
  FETCH_NOTAS,
  VOICE_START
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
        Voice.destroy().then(Voice.removeAllListeners);
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

export const initRec = (onResults) => {
  return (dispatch) => {
    Voice.onSpeechStart = onSpeechStart.bind(this);
    // Voice.onSpeechRecognized = this.onSpeechRecognized.bind(this);
    Voice.onSpeechEnd = onSpeechEnd.bind(this);
    Voice.onSpeechError = onSpeechError.bind(this);
    // Voice.onSpeechResults = this.onSpeechResults.bind(this);
    Voice.onSpeechPartialResults = onResults.bind(this);
    // Voice.onSpeechVolumeChanged = this.onSpeechVolumeChanged.bind(this);
    dispatch({ type: VOICE_START });
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

const onSpeechStart = () => {
};

const onSpeechEnd = () => {
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
