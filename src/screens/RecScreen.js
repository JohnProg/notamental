import React, { Component } from 'react';
import { View, TextInput } from 'react-native';
import { FormValidationMessage, Icon } from 'react-native-elements';
import { connect } from 'react-redux';
import ActionButton from 'react-native-action-button';
import ModalShare from '../components/ModalShare';
import ModalCategories from '../components/ModalCategories';
import ItemsList from '../components/ItemsList';
import { NOTA_CATEGORY } from '../utils/categories';


import {
  resetNota,
  notaChanged,
  saveNota,
  deleteNota,
  inviteNota,
  initNota,
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
        value={navigation.state.params.title ? navigation.state.params.title : null}
        onChangeText={value => {
          navigation.state.params.notaChanged({ prop: 'title', value });
          navigation.setParams({ title: value });
        }}
      />
    ),
    headerRight: (
      <View style={{ flexDirection: 'row' }}>
        <Icon
          title="Categorias"
          size={30}
          onPress={() => navigation.state.params.categoriesPress()}
          backgroundColor="rgba(0,0,0,0)"
          color="#000000"
          type='entypo'
          name={navigation.state.params.category ? navigation.state.params.category : 'archive'}
          containerStyle={{ marginRight: 10 }}
        />
        <Icon
          title="Compartir"
          size={30}
          onPress={() => navigation.state.params.sharePress()}
          backgroundColor="rgba(0,0,0,0)"
          color="#000000"
          type='entypo'
          name='share'
          containerStyle={{ marginRight: 10 }}
        />
        <Icon
          title="Borrar"
          size={30}
          onPress={() => navigation.state.params.deletePress()}
          backgroundColor="rgba(0,0,0,0)"
          color="#000000"
          type='entypo'
          name='trash'
          containerStyle={{ marginRight: 5 }}
        />
      </View>
    ),
    headerStyle: {
      paddingRight: 5
    }
  })

  state = {
    isShareModalVisible: false,
    isCatModalVisible: false,
    pos: 0
  }

  componentWillMount() {
    this.props.initNota(this.onResults, this.onEnding, this.props.nota);
  }

  componentDidMount() {
    this.props.navigation.setParams({
     category: this.props.nota.category.key,
     title: this.props.nota.title,
     sharePress: this.sharePress.bind(this),
     categoriesPress: this.categoriesPress.bind(this),
     deletePress: this.deletePress.bind(this),
     savePress: this.savePress.bind(this),
     notaChanged: this.props.notaChanged
    });
  }

  componentWillUnmount() {
    this.savePress();
    this.props.resetNota();
  }

  onResults = (e) => {
    const value = e.value.pop();
    const { text } = this.props.nota;
    text[this.state.pos] = { val: value };
    this.props.notaChanged({ prop: 'text', value: text });
  }

  onEnding = () => {
    this.props.recordEnd();
  }

  onPressCategory(category) {
    this.props.notaChanged({ prop: 'category', value: category });
    this.props.navigation.setParams({ category: category.key });
    this.setState({ isCatModalVisible: false });
  }


  savePress = () => {
    const { nota } = this.props;
    const { title, text } = nota;
    const str = text.map(item => item.val);
    if (title || str.join('')) {
      this.props.saveNota(nota);
    } else {
      this.props.deleteNota(nota);
    }
  }

  deletePress = () => {
    const { nota, navigation } = this.props;
    this.props.deleteNota(nota);
    navigation.goBack();
  };

  categoriesPress = () => {
    this.setState({ isCatModalVisible: true });
  };


  sharePress = () => {
    this.setState({ isShareModalVisible: true });
  };

  inviteNota(email) {
    const { uid, members } = this.props.nota;
    this.props.inviteNota({ email, uid, members });
    this.setState({ isShareModalVisible: false });
  }

  handleBackdropPress() {
    this.setState({ isShareModalVisible: false, isCatModalVisible: false });
  }


  recPress = () => {
    const { text, focused } = this.props.nota;
    if (!focused) {
      this.setState({ pos: !text.map(item => item.val).join('') ? 0 : text.length - 1 });
    } else {
      this.setState({ pos: focused });
    }
    this.props.startRecognizing();
  }

  nextItem = () => {
    const { text } = this.props.nota;
    this.props.notaChanged({ prop: 'text', value: text.push[''] });
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
          <FormValidationMessage>{this.props.error}</FormValidationMessage>
          <ItemsList
            items={this.props.nota.text}
            onFocus={this.props.recording ? this.state.pos : false}
            onChangeText={this.props.notaChanged}
            position={this.props.nota.position}
          />
          <FormValidationMessage>{this.props.error}</FormValidationMessage>
        {this.renderMic()}
        <ModalShare
          onBackdropPress={this.handleBackdropPress.bind(this)}
          isVisible={this.state.isShareModalVisible}
          sendInvite={this.inviteNota.bind(this)}
          members={this.props.nota.members}
        />
        <ModalCategories
          onBackdropPress={this.handleBackdropPress.bind(this)}
          isVisible={this.state.isCatModalVisible}
          onPressCategory={this.onPressCategory.bind(this)}
          categories={NOTA_CATEGORY}
        />
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  const { error, recording, nota } = state.notasRec;
  console.log(state.notasRec);
  return { error, recording, nota };
};

export default connect(mapStateToProps, {
  resetNota,
  notaChanged,
  saveNota,
  initNota,
  inviteNota,
  startRecognizing,
  recordEnd,
  deleteNota
})(RecScreen);
