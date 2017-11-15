import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { Card, FormLabel, FormInput, Button, FormValidationMessage } from 'react-native-elements';
import { Spinner } from '../components/common';
import { propChanged, signUp } from '../actions';

class RegisterScreen extends Component {
  onPropChange({ prop, value }) {
    this.props.propChanged({ prop, value });
  }

  onSignPress() {
    const { email, password, cPassword } = this.props;
    this.props.signUp({ email, password, cPassword });
  }

  renderButton() {
    if (this.props.loading) {
      return <Spinner />;
    }
    return (
      <Button
        buttonStyle={{ marginTop: 20 }}
        backgroundColor="#03A9F4"
        title="SIGN UP"
        onPress={this.onSignPress.bind(this)}
      />
    );
  }

  render() {
    return (
      <View style={{ paddingVertical: 20 }}>
        <Card>
          <FormLabel>Email</FormLabel>
          <FormInput
            placeholder="Email..."
            value={this.props.email}
            onChangeText={value => this.onPropChange({ prop: 'email', value })}
          />
          <FormLabel>Password</FormLabel>
          <FormInput
            placeholder="Password"
            value={this.props.password}
            onChangeText={value => this.onPropChange({ prop: 'password', value })}
          />
          <FormLabel>Confirm Password</FormLabel>
          <FormInput
            placeholder="Email address..."
            value={this.props.cPassword}
            onChangeText={value => this.onPropChange({ prop: 'cPassword', value })}
          />
          <FormValidationMessage>{this.props.error}</FormValidationMessage>
          {this.renderButton()}
        </Card>
      </View>
    );
  }
}

const mapStateToProps = state => {
  const { email, password, cPassword, error, loading } = state.login;
  return { email, password, cPassword, error, loading };
};

export default connect(mapStateToProps, { propChanged, signUp })(RegisterScreen);
