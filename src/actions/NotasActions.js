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


export const saveNota = ({ title, text, uid, members, category }) => {
  return (dispatch) => {
      firebase.database().ref(`/notas/${uid}`).update({
        title,
        text,
        category,
        members,
        timestamp: new Date(),
      })
      .then(() => {
          dispatch({ type: SAVE_NOTA, payload: '' });
      })
      .catch((err) => dispatch({ type: SAVE_NOTA, payload: err.message }));
  };
};

export const deleteNota = ({ uid, members }) => {
  const { currentUser } = firebase.auth();
  return (dispatch) => {
    handleDelete(uid, dispatch);
    firebase.database().ref(`/notas/${uid}`).off();
    firebase.database().ref(`/editors/${currentUser.uid}/${uid}`).remove()
    .then(() => {
      _.unset(members, currentUser.uid);
      if (_.isEmpty(members)) {
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
      .once('value', snap => {
       const userId = _.map(snap.val(), (value, index) => index);
       firebase.database().ref(`editors/${userId}`).update(notaKey)
          .then(() => {
            firebase.database().ref(`notas/${uid}/members`).update({ [userId]: email })
              .then(() => {
                dispatch({ type: INVITE_NOTA, payload: '' });
              })
              .catch((e) => dispatch({ type: INVITE_NOTA, payload: e.message }));
          })
          .catch((e) => dispatch({ type: INVITE_NOTA, payload: e.message }));
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
    let newNota = nota;
    if (!uid) {
      const { currentUser } = firebase.auth();
      const ref = firebase.database().ref('/notas').push();
      newNota = {
        title: '',
        text: [{ val: '' }],
        timestamp: new Date(),
        ownerId: currentUser.uid,
        category: { key: 'archive', label: 'Varios' },
        members: { [currentUser.uid]: currentUser.email },
        uid: ref.key
      };
      ref.set(newNota);
          const join = firebase.database().ref(`/editors/${currentUser.uid}`);
          const notaKey = { [ref.key]: true };
          join.update(notaKey);
          uid = ref.key;
    }
    dispatch({ type: NOTA_INIT, payload: newNota });
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
