import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Button, Card } from 'react-native-elements';
import { connect } from 'react-redux';

import { Spinner } from '../components/common';
import { userLoggout } from '../actions';

class SettingsScreen extends Component {
  static navigationOptions = () => ({
    title: 'Ajustes',
    tabBarVisible: false,
  })

  onLoggoutPress = () => {
    const { navigation } = this.props;
    this.props.userLoggout(navigation);
  }

  renderButton = () => {
    if (this.props.loading) {
      return <Spinner />;
    }
    return (
      <Button
        title='Cerrar Session'
        textStyle={{ fontSize: 20 }}
        icon={{ name: 'check' }}
        buttonStyle={{ marginTop: 20 }}
        onPress={this.onLoggoutPress}
      />
    );
  }

  render() {
    return (
      <View>
        <Card
          title='EMAIL'
        >
          <Text style={{ marginBottom: 10 }} >
            {this.props.user.email}
          </Text>
        </Card>
        {this.renderButton()}
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  const { loading, user } = state.login;
  return { loading, user };
};


export default connect(mapStateToProps, { userLoggout })(SettingsScreen);
