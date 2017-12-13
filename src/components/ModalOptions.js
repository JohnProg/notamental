import React, { Component } from 'react';
import { View, Text } from 'react-native';
import Modal from 'react-native-modal';
import { Button, FormInput, Card } from 'react-native-elements';

class ModalOptions extends Component {
  state = {
    emailInvite: ''
  }

  handleInvite() {
    this.props.sendInvite({ email: this.state.emailInvite });
  }

  renderButton({ prop, action }) {
    return (
      <Button
        raised
        icon={{ name: 'trash', type: 'entypo' }}
        onPress={action.bind(this)}
        title={prop}
      />
    );
  }

  renderInvitation() {
    return (
      <View>
        <FormInput
          placeholder='email@colega.com'
          inputStyle={{ fontSize: 18 }}
          textAlignVertical={'top'}
          value={this.state.emailInvite}
          onChangeText={value => this.setState({ emailInvite: value })}
        />
        <Button
          raised
          icon={{ name: 'trash', type: 'entypo' }}
          onPress={this.handleInvite.bind(this)}
          title={'Enviar invitacion'}
        />
      </View>
    );
  }

  render() {
    return (
      <Modal
        isVisible={this.props.isVisible}
        onBackdropPress={this.props.onBackdropPress}
        animationIn={'zoomInDown'}
        animationOut={'zoomOutUp'}
      >
        <Card containerStyle={styles.modalContent}>
          <Text>
            Testing
          </Text>
          {this.props.deleteNota ? (this.renderButton({
            prop: 'BORRAR',
            iconType: { name: 'trash', type: 'entypo' },
            action: this.props.deleteNota
          })) : null}
          {this.props.inviteNota ? (this.renderButton({
            prop: 'INVITAR',
            iconType: { name: 'trash', type: 'entypo' },
            action: this.props.inviteNota
          })) : null}
          {this.props.sendInvite ? this.renderInvitation() : null }
        </Card>
      </Modal>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: 'lightblue',
    padding: 12,
    margin: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  modalContent: {
    // backgroundColor: 'white',
    // padding: 22,
    // justifyContent: 'center',
    // alignItems: 'center',
    borderRadius: 4,
    // borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  bottomModal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
};

export default ModalOptions;
