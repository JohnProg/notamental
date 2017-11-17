import React, { Component } from 'react';
import { View } from 'react-native';
import _ from 'lodash';
import { FormInput, FormValidationMessage, Icon } from 'react-native-elements';
import { connect } from 'react-redux';
import ActionButton from 'react-native-action-button';
import { BubblesLoader, TextLoader } from 'react-native-indicator';
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

  static navigationOptions = ({ navigation }) => ({
    title: 'Nota',
    tabBarVisible: false,
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
    isShareModalVisible: false
  }

  componentWillMount() {
    this.props.initRec(this.onResults, this.onEnding);
    this.props.navigation.setParams({ showShare: false });

    const { state } = this.props.navigation;
    const nota = state.params ? state.params.nota : null;
    if (nota) {
      _.each(nota, (value, prop) => {
        this.props.notaChanged({ prop, value });
      });
    }
  }

  componentDidMount() {
    this.props.navigation.setParams({
     sharePress: this.sharePress.bind(this),
     deletePress: this.deletePress.bind(this),
     savePress: this.savePress.bind(this)
   });
  }

  componentWillUnmount() {
    this.props.resetNota();
  }

  onResults = (e) => {
    e.value.map(value => this.props.notaChanged({ prop: 'text', value }));
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
    this.props.startRecognizing();
  }

  renderMic = () => {
    const { recording } = this.props;
    if (recording) {
      return (
        <View>
          <BubblesLoader />
          <TextLoader text='Escuchando' />
        </View>
      );
    }
    return (
      <ActionButton
        buttonColor="rgba(231,76,60,1)"
        icon={<Icon name='mic' size={22} />}
        onPress={this.recPress.bind(this)}
      />
    );
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <ItemsList
          items={this.props.text}
        />
        <FormValidationMessage>{this.props.error}</FormValidationMessage>
        <ModalOptions
          onBackdropPress={this.handleBackdropPress.bind(this)}
          isVisible={this.state.isShareModalVisible}
          sendInvite={this.inviteNota.bind(this)}
        />
        {this.renderMic()}
      </View>
    );
  }
}

const styles = {
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
