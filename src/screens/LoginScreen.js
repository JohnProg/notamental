import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { FormLabel, FormInput, FormValidationMessage, Button } from 'react-native-elements';
import firebase from 'react-native-firebase';

import { emailChanged, passwordChanged, loginUser, userLogged } from '../actions';
import { Spinner } from '../components/common';

class LoginScreen extends Component {
  componentWillMount = () => {
    const { navigation } = this.props;
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.props.userLogged(user, navigation);
        navigation.navigate('main');
      }
    });
  }

  onEmailChange = (email) => {
    this.props.emailChanged(email);
  }

  onPasswordChange = (password) => {
    this.props.passwordChanged(password);
  }

  loginPress = () => {
    const { email, password, navigation } = this.props;
    this.props.loginUser({ email, password, navigation });
  }

  renderButton = () => {
    if (this.props.loading) {
      return <Spinner />;
    }
    return (
      <Button
        title='Login'
        textStyle={{ fontSize: 20 }}
        icon={{ name: 'check' }}
        buttonStyle={{ marginTop: 20 }}
        onPress={this.loginPress}
      />
    );
  }

  render() {
    return (
      <View>
        <FormLabel labelStyle={{ fontSize: 18 }} >
          Name
        </FormLabel>
        <FormInput
          inputStyle={{ fontSize: 18 }}
          placeholder="user@domain.com"
          value={this.props.email}
          onChangeText={this.onEmailChange}
        />
        <FormLabel labelStyle={{ fontSize: 18 }} >
          Password
        </FormLabel>
        <FormInput
          secureTextEntry
          inputStyle={{ fontSize: 18 }}
          placeholder="Password"
          value={this.props.password}
          onChangeText={this.onPasswordChange}
        />
        <FormValidationMessage>{this.props.err}</FormValidationMessage>

        {this.renderButton()}
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
  emailChanged,
  passwordChanged,
  loginUser,
  userLogged
})(LoginScreen);
