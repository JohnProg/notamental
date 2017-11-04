import React, { Component } from 'react';
import { View } from 'react-native';
import { FormInput, Button } from 'react-native-elements';
import { connect } from 'react-redux';
import { notaChanged, createNota } from '../actions';
import Listener from '../components/Listener';

class RecScreen extends Component {
  static navigationOptions = () => ({
    title: 'Guardando Nota',
    tabBarVisible: false,
  })

  createPress = () => {
    const { title, text, navigation } = this.props;
    this.props.createNota({ title, text, navigation });
  }

  cancelPress = () => {

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
        <Button
          title='Guardar'
          textStyle={{ fontSize: 20 }}
          icon={{ name: 'check' }}
          buttonStyle={{ marginTop: 20 }}
          onPress={this.createPress.bind(this)}
        />
        <Listener />
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  const { title, text } = state.notasRec;
  return { title, text };
};

export default connect(mapStateToProps, { notaChanged, createNota })(RecScreen);
