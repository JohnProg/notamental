import React, { Component } from 'react';
import { View } from 'react-native';
import { FormInput, FormValidationMessage, Button } from 'react-native-elements';
import { connect } from 'react-redux';
import { notaChanged, createNota, initRec, startRecognizing } from '../actions';
import Listener from '../components/Listener';

class RecScreen extends Component {
  static navigationOptions = () => ({
    title: 'Guardando Nota',
    tabBarVisible: false,
  })

  componentWillMount() {
    this.props.initRec(this.onResults);
  }

  onResults = (e) => {
    e.value.map(value => this.props.notaChanged({ prop: 'text', value }));
  };

  createPress = () => {
    const { title, text, navigation } = this.props;
    this.props.createNota({ title, text, navigation });
  }

  recPress = () => {
    this.props.startRecognizing();
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
        <Button
          title='Record'
          textStyle={{ fontSize: 20 }}
          icon={{ name: 'check' }}
          buttonStyle={{ marginTop: 20 }}
          onPress={this.recPress.bind(this)}
        />
        <Button
          title='Guardar'
          textStyle={{ fontSize: 20 }}
          icon={{ name: 'check' }}
          buttonStyle={{ marginTop: 20 }}
          onPress={this.createPress.bind(this)}
        />
      </View>
    );
  }
}
// <Listener {...this.props} />

const mapStateToProps = (state) => {
  const { title, text, error } = state.notasRec;
  return { title, text, error };
};

export default connect(mapStateToProps, { notaChanged, createNota, initRec, startRecognizing })(RecScreen);
