import firebase from 'react-native-firebase';
import Voice from 'react-native-voice';
import _ from 'lodash';
import {
  NOTA_CHANGED,
  CREATE_NOTA,
  SAVE_NOTA,
  DELETE_NOTA,
  FETCH_NOTAS,
  INVITE_NOTA,
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
      firebase.database().ref(`/notas/${uid}`).set({
        title,
        text,
        timestamp: new Date(),
      }).then(() => {
          dispatch({ type: SAVE_NOTA });
          navigation.goBack();
      });
    } else {
      const ref = firebase.database().ref('/notas').push();
      const userMember = { [currentUser.uid]: true };
      ref.set({
        title,
        text,
        timestamp: new Date(),
        ownerId: currentUser.uid,
        members: userMember
      }).then(() => {
          const join = firebase.database().ref(`/editors/${currentUser.uid}`);
          const notaKey = { [ref.key]: true };
          join.update(notaKey)
          .then(() => {
            dispatch({ type: CREATE_NOTA });
            navigation.goBack();
          });
      });
    }
  };
};

export const deleteNota = ({ nota, navigation }) => {
  const { uid } = nota;
  const { currentUser } = firebase.auth();
  return (dispatch) => {
    firebase.database().ref(`/editors/${currentUser.uid}/${uid}`).remove();
    _.unset(nota.members, currentUser.uid);
    if (_.isEmpty(nota.members)) {
      firebase.database().ref(`/notas/${uid}`).remove()
        .then(() => {
          handleDelete(uid, dispatch, navigation);
        });
    } else {
      firebase.database().ref(`/notas/${uid}/members/${currentUser.uid}`).remove();
        handleDelete(uid, dispatch, navigation);
    }
  };
};

export const fetchNotas = () => {
   const { currentUser } = firebase.auth();
   return (dispatch) => {
     const ref = firebase.database().ref(`/editors/${currentUser.uid}`);
     ref.on('value', snapshot => {
        const memberOf = snapshot.val();
        _.map(memberOf, (val, index) => {
          const refData = firebase.database().ref(`/notas/${index}`);
          refData.on('value', snapshotData => {
            if (!snapshotData.exists()) {
              dispatch({
                type: FETCH_NOTAS,
                payload: snapshotData
              });
              refData.off();
            } else {
              dispatch({
                type: FETCH_NOTAS,
                payload: snapshotData
              });
            }
          });
        });
    });
  };
};

export const inviteNota = ({ email, uid }) => {
  const notaKey = { [uid]: true };
  return (dispatch) => {
     const ref = firebase.database().ref('users');
     ref.orderByChild('email').startAt(email).endAt(email)
      .on('value', snap => {
       _.map(snap.val(), (value, index) => {
         firebase.database().ref(`editors/${index}`).update(notaKey)
          .then(() => {
            const userMember = { [index]: true };
            firebase.database().ref(`notas/${uid}/members`).update(userMember)
              .then(() => {
                dispatch({ type: INVITE_NOTA });
              });
          });
       });
     });
  };
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

const handleDelete = (uid, dispatch, navigation) => {
  dispatch({ type: DELETE_NOTA });
  firebase.database().ref(`/notas/${uid}`).off();
  if (navigation.state.routeName === 'rec') {
    navigation.goBack();
  }
};

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
