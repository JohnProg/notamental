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
        backgroundColor={'black'}
        icon={{ name: 'trash', type: 'entypo' }}
        onPress={action.bind(this)}
        title={prop}
      />
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
          <Button
            raised
            borderRadius={4}
            backgroundColor={'black'}
            containerViewStyle={{ marginBottom: 10 }}
            icon={{ type: 'entypo', name: 'trash' }}
            title='Borrar Nota'
            onPress={() => this.props.deleteNota()}
          />
          <Button
            raised
            borderRadius={4}
            backgroundColor={'black'}
            icon={{ type: 'entypo', name: 'share' }}
            title='Compartir Nota'
            onPress={() => this.props.inviteNota()}
          />
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
    borderRadius: 4,
  },
  bottomModal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
};

export default ModalOptions;
