import React, { Component } from 'react';
import { View, Text } from 'react-native';
import Modal from 'react-native-modal';
import { Button } from 'react-native-elements';

class ModalOptions extends Component {
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

  render() {
    return (
      <Modal
        isVisible={this.props.isVisible}
        animationIn={'zoomInDown'}
        animationOut={'zoomOutUp'}
      >
        <View style={styles.modalContent} >
          <Text>
            Testing
          </Text>
          {this.renderButton({ prop: 'Delete', action: this.props.deleteNota })}
        </View>
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
    backgroundColor: 'white',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  bottomModal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
};

export default ModalOptions;
