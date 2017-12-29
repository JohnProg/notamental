import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { Card, FormLabel, FormInput, FormValidationMessage, Button } from 'react-native-elements';
import firebase from 'react-native-firebase';
import SplashScreen from 'react-native-splash-screen';

import { propChanged, loginUser, userLogged, googleLogin } from '../actions';
import { Spinner } from '../components/common';

class LoginScreen extends Component {
  static navigationOptions = () => ({
    title: 'Acceder'
  });
  componentWillMount = () => {
    const { navigation } = this.props;
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.props.userLogged(user, navigation);
        navigation.navigate('main');
      }
    });
  }

  componentDidMount() {
  // do stuff while splash screen is shown
    // After having done stuff (such as async tasks) hide the splash screen
    SplashScreen.hide();
  }

  onPropChange({ prop, value }) {
    this.props.propChanged({ prop, value });
  }

  onSignUp() {
    this.props.navigation.navigate('register');
  }

  loginPress = () => {
    const { email, password, navigation } = this.props;
    this.props.loginUser({ email, password, navigation });
  }

  loginGooglePress() {
    this.props.googleLogin(this.props.navigation);
  }

  renderButton() {
    if (this.props.loading) {
      return <Spinner />;
    }
    return (
      <View>
        <Button
          title='Acceder'
          buttonStyle={{ marginTop: 20 }}
          backgroundColor="#03A9F4"
          icon={{ name: 'check' }}
          onPress={this.loginPress.bind(this)}
        />
        <Button
          title='Registrarse'
          buttonStyle={{ marginTop: 20 }}
          backgroundColor="#03A9F4"
          icon={{ name: 'check' }}
          onPress={this.onSignUp.bind(this)}
        />
        <Button
          title='Entra con Google'
          buttonStyle={{ marginTop: 20 }}
          backgroundColor="#FF2400"
          icon={{ name: 'google--with-circle', type: 'entypo', size: 28 }}
          onPress={this.loginGooglePress.bind(this)}
        />
      </View>
    );
  }

  render() {
    return (
      <View style={{ paddingVertical: 20 }}>
        <Card>
          <FormLabel>Usuario</FormLabel>
          <FormInput
            placeholder="usuario@dominio.com"
            value={this.props.email}
            onChangeText={value => this.onPropChange({ prop: 'email', value })}
          />
          <FormLabel>Contraseña</FormLabel>
          <FormInput
            secureTextEntry
            placeholder="Contraseña"
            value={this.props.password}
            onChangeText={value => this.onPropChange({ prop: 'password', value })}
          />
          <FormValidationMessage>{this.props.err}</FormValidationMessage>
          {this.renderButton()}
        </Card>
      </View>
    );
  }
}


const mapStateToProps = ({ login }) => {
  const { email, password, loading, err } = login;
  return {
    email, password, loading, err
  };
};

export default connect(mapStateToProps, {
  propChanged,
  loginUser,
  userLogged,
  googleLogin
})(LoginScreen);
