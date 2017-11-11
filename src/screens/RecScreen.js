import React, { Component } from 'react';
import { View } from 'react-native';
import _ from 'lodash';
import { FormInput, FormValidationMessage, Icon } from 'react-native-elements';
import { connect } from 'react-redux';
import { PulseIndicator } from 'react-native-indicators';
import {
  resetNota,
  notaChanged,
  saveNota,
  deleteNota,
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

  componentWillMount() {
    this.props.initRec(this.onResults, this.onEnding);

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

  recPress = () => {
    this.props.startRecognizing();
  }

  renderMic = () => {
    const { recording } = this.props;
    console.log(recording);
    if (recording) {
      return <PulseIndicator color='blue' />;
    }
    return (
      <Icon
      title="Grabar"
      size={50}
      containerStyle={styles.iconStyle}
      onPress={this.recPress.bind(this)}
      backgroundColor="rgba(0,0,0,0)"
      color="rgba(0,122,255,1)"
      name='mic'
      type='entypo'
      />
    );
  }

  render() {
    return (
      <View>
        <FormInput
          inputStyle={{ fontSize: 18 }}
          placeholder='Titulo'
          value={this.props.title}
          onChangeText={value => this.props.notaChanged({ prop: 'title', value })}
        />
        <FormInput
          placeholder='Escribe tu nota aquí'
          inputStyle={{ fontSize: 18 }}
          numberOfLines={8}
          textAlignVertical={'top'}
          multiline
          value={this.props.text}
          onChangeText={value => this.props.notaChanged({ prop: 'text', value })}
        />
        <FormValidationMessage>{this.props.error}</FormValidationMessage>
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
  startRecognizing,
  recordEnd,
  deleteNota
})(RecScreen);
