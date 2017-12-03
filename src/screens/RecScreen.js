import React, { Component } from 'react';
import { View, TextInput } from 'react-native';
import _ from 'lodash';
import { FormInput, FormValidationMessage, Icon } from 'react-native-elements';
import { connect } from 'react-redux';
import ActionButton from 'react-native-action-button';
import ModalOptions from '../components/ModalOptions';
import ItemsList from '../components/ItemsList';

import {
  resetNota,
  notaChanged,
  saveNota,
  deleteNota,
  inviteNota,
  initRec,
  startRecognizing,
  recordEnd
} from '../actions';

class RecScreen extends Component {

  static navigationOptions = ({ navigation }) => (
    {
    tabBarVisible: false,
    headerTitle: (
      <TextInput
        style={{ width: 190, height: 50, fontSize: 20, fontWeight: 'bold' }}
        placeholder='Titulo Nota'
        value={navigation.state.params.nota ? navigation.state.params.title : null}
        onChangeText={value => {
          navigation.state.params.notaChanged({ prop: 'title', value });
          navigation.setParams({ title: value });
        }}
      />
    ),
    headerRight: (
      <View style={{ flexDirection: 'row' }}>
        {navigation.state.params.showShare ?
        <Icon
        title="Compartir"
        size={30}
        onPress={() => navigation.state.params.sharePress()}
        backgroundColor="rgba(0,0,0,0)"
        color="rgba(0,122,255,1)"
        type='entypo'
        name='share'
        containerStyle={{ marginRight: 10 }}
        /> : null }
        <Icon
          title="Borrar"
          size={30}
          onPress={() => navigation.state.params.deletePress()}
          backgroundColor="rgba(0,0,0,0)"
          color="rgba(0,122,255,1)"
          type='entypo'
          name='trash'
          containerStyle={{ marginRight: 10 }}
        />
        <Icon
          title="Guardar"
          size={30}
          onPress={() => navigation.state.params.savePress()}
          backgroundColor="rgba(0,0,0,0)"
          color="rgba(0,122,255,1)"
          type='entypo'
          name='save'
        />
      </View>
    ),
    headerStyle: {
      paddingRight: 10
    }
  })

  state = {
    isShareModalVisible: false,
    isFocused: 0
  }

  componentWillMount() {
    this.props.initRec(this.onResults, this.onEnding);
    this.props.navigation.setParams({ showShare: false });

    const { state } = this.props.navigation;
    const nota = state.params ? state.params.nota : null;
    if (nota) {
      this.props.navigation.setParams({ title: nota.title });
      _.each(nota, (value, prop) => {
        this.props.notaChanged({ prop, value });
      });
    }
  }

  componentDidMount() {
    this.props.navigation.setParams({
     sharePress: this.sharePress.bind(this),
     deletePress: this.deletePress.bind(this),
     savePress: this.savePress.bind(this),
     notaChanged: this.props.notaChanged
    });
  }

  componentWillUnmount() {
    this.props.resetNota();
  }

  onResults = (e) => {
    const value = e.value.pop();
    let newItems = this.props.text;
    let { recording } = this.props;
    if (this.props.navigation.state.params.type === 'list') {
      if (!(recording + 1)) {
        this.props.notaChanged({ prop: 'recording', value: 0 });
        recording = 0;
      }
      newItems[this.props.recording] = value;
    } else {
      newItems = value;
    }
    this.props.notaChanged({ prop: 'text', value: newItems });
  }

  onEnding = () => {
    this.props.recordEnd();
  }

  savePress = () => {
    const { title, text, navigation, uid } = this.props;
    this.props.saveNota({ title, text, navigation, uid });
  }

  deletePress = () => {
    const { uid, navigation } = this.props;
    this.props.deleteNota({ uid, navigation });
  };

  sharePress = () => {
    this.setState({ isShareModalVisible: true });
  };

  inviteNota({ email }) {
    this.props.inviteNota({ email, uid: this.props.uid });
  }

  handleBackdropPress() {
    this.setState({ isShareModalVisible: false });
  }


  recPress = () => {
    let recording = true;
    if (this.props.text.constructor === Array) {
      recording = this.props.text.length - 1;
    }
    this.props.startRecognizing(recording);
  }

  nextItem = () => {
    this.setState({ isFocused: this.state.isFocused + 1 });
  }

  renderMic = () => {
    const { recording } = this.props;
    if (recording) {
      return (
        <ActionButton
          buttonColor="rgba(231,76,60,1)"
          icon={<Icon name='keyboard-return' size={30} />}
          onPress={this.nextItem.bind(this)}
        />
      );
    }
    return (
      <ActionButton
        buttonColor="rgba(231,76,60,1)"
        style={{ zIndex: 999 }}
        icon={<Icon name='mic' size={30} />}
        onPress={this.recPress.bind(this)}
      />
    );
  }

  render() {
    return (
      <View style={{ flex: 1 }} >
          <ItemsList
            items={this.props.text}
            onFocus={this.props.recording}
            onChangeText={this.props.notaChanged}
          />
          <FormValidationMessage>{this.props.error}</FormValidationMessage>
        {this.renderMic()}
        <ModalOptions
          onBackdropPress={this.handleBackdropPress.bind(this)}
          isVisible={this.state.isShareModalVisible}
          sendInvite={this.inviteNota.bind(this)}
        />
      </View>
    );
  }
}

const styles = {
  centering: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  iconStyle: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20
  }
};

const mapStateToProps = (state) => {
  const { title, text, error, uid, recording } = state.notasRec;
  return { title, text, error, uid, recording };
};

export default connect(mapStateToProps, {
  resetNota,
  notaChanged,
  saveNota,
  initRec,
  inviteNota,
  startRecognizing,
  recordEnd,
  deleteNota
})(RecScreen);

// <FormInput
//   inputStyle={{ fontSize: 18 }}
//   placeholder='Titulo'
//   value={this.props.title}
//   onChangeText={value => this.props.notaChanged({ prop: 'title', value })}
// />
// <FormInput
//   placeholder='Escribe tu nota aquí'
//   inputStyle={{ fontSize: 18 }}
//   numberOfLines={8}
//   textAlignVertical={'top'}
//   multiline
//   value={this.props.text}
//   onChangeText={value => this.props.notaChanged({ prop: 'text', value })}
// />
