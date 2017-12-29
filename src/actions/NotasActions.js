import firebase from 'react-native-firebase';
import Voice from 'react-native-voice';
import _ from 'lodash';
import {
  NOTA_CHANGED,
  SAVE_NOTA,
  DELETE_NOTA,
  FETCH_NOTAS,
  INVITE_NOTA,
  VOICE_START,
  VOICE_END,
  NOTA_INIT,
  RESET_NOTA,
  EDIT_NOTA
} from './types';

let record = false;

export const resetNota = () => {
  if (record) {
    Voice.destroy()
      .then(Voice.removeAllListeners);
    record = false;
  }
  return { type: RESET_NOTA };
};

export const notaChanged = ({ prop, value }) => ({
    type: NOTA_CHANGED,
    payload: { prop, value }
});

export const editNota = ({ nota }) => ({
  type: EDIT_NOTA,
  payload: nota
});


export const saveNota = ({ title, text, uid }) => {
  return (dispatch) => {
    console.log('SaveUID: ', uid);
      firebase.database().ref(`/notas/${uid}`).update({
        title,
        text,
        timestamp: new Date(),
      })
      .then(() => {
          dispatch({ type: SAVE_NOTA });
      })
      .catch((err) => console.log('SavingErr: ', err));
  };
};

export const deleteNota = ({ nota }) => {
  const { uid } = nota;
  const { currentUser } = firebase.auth();
  return (dispatch) => {
    handleDelete(uid, dispatch);
    firebase.database().ref(`/notas/${uid}`).off();
    firebase.database().ref(`/editors/${currentUser.uid}/${uid}`).remove()
    .then(() => {
      _.unset(nota.members, currentUser.uid);
      if (_.isEmpty(nota.members)) {
        firebase.database().ref(`/notas/${uid}`).remove()
          .catch((er) => console.log(er));
      } else {
        firebase.database().ref(`/notas/${uid}/members/${currentUser.uid}`).remove()
        .catch((err) => console.log(err));
      }
    })
    .catch((err) => console.log(err));
  };
};

export const fetchNotas = () => {
   const { currentUser } = firebase.auth();
   return (dispatch) => {
     const ref = firebase.database().ref(`/editors/${currentUser.uid}`);
     ref.on('child_added', notaId => {
       handleFetch(notaId.key, dispatch);
    });
  };
};

export const inviteNota = ({ email, uid }) => {
  const notaKey = { [uid]: true };
  return (dispatch) => {
     const ref = firebase.database().ref('users');
     ref.orderByChild('email').startAt(email).endAt(email)
      .on('value', snap => {
        console.log('step1: ', snap.val());
       _.map(snap.val(), (value, index) => {
         firebase.database().ref(`editors/${index}`).update(notaKey)
          .then(() => {
            console.log('step2 ');
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

export const initNota = (onResults, onEnding, nota) => {
  let { uid } = nota;
  return (dispatch) => {
    Voice.onSpeechStart = onSpeechStart.bind(this);
    // Voice.onSpeechRecognized = this.onSpeechRecognized.bind(this);
    Voice.onSpeechEnd = onEnding.bind(this);
    Voice.onSpeechError = onSpeechError.bind(this);
    // Voice.onSpeechResults = this.onSpeechResults.bind(this);
    Voice.onSpeechPartialResults = onResults.bind(this);
    // Voice.onSpeechVolumeChanged = this.onSpeechVolumeChanged.bind(this);
    if (!uid) {
      const { currentUser } = firebase.auth();
      const ref = firebase.database().ref('/notas').push();
      const userMember = { [currentUser.uid]: true };
      ref.set({
        title: '',
        text: '',
        timestamp: new Date(),
        ownerId: currentUser.uid,
        members: userMember
      });
          const join = firebase.database().ref(`/editors/${currentUser.uid}`);
          const notaKey = { [ref.key]: true };
          join.update(notaKey);
          uid = ref.key;
    }
    dispatch({ type: NOTA_INIT, payload: uid });
  };
};

export const startRecognizing = () => {
  return (dispatch) => {
    Voice.start('es-ES')
      .then(() => {
        dispatch({
          type: VOICE_START,
        });
      }).catch((e) => {
        dispatch({
          type: VOICE_START
        });
        notaChanged({ prop: 'error', value: e.error.message });
      });
  };
};

export const recordEnd = () => ({ type: VOICE_END });


const handleFetch = (key, dispatch) => {
  const refData = firebase.database().ref(`/notas/${key}`);
  refData.on('value', snapshotData => {
    if (!snapshotData.exists()) {
      refData.off();
    }
    dispatch({
      type: FETCH_NOTAS,
      payload: snapshotData
    });
  });
};

const handleDelete = (uid, dispatch) => {
  dispatch({ type: DELETE_NOTA, payload: uid });
};

const onSpeechStart = () => {
  record = true;
};

const onSpeechError = (e) => {
  notaChanged({ prop: 'error', value: e.error.message });
};
