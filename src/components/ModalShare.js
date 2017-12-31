import React, { Component } from 'react';
import { FlatList, View, TextInput } from 'react-native';
import Modal from 'react-native-modal';
import { Card, ListItem, Icon, FormLabel } from 'react-native-elements';
import _ from 'lodash';

class ModalCategories extends Component {

  renderRow = (rowData) => {
    const member = rowData.item;
    return (
      <ListItem
        roundAvatar
        hideChevron
        leftIcon={{ name: 'user', type: 'entypo', color: 'black' }}
        key={member.uid}
        title={member.email}
      />
    );
  }

  keyExtractor(member) {
    return member.uid;
  }

  render() {
    const members = _.map(this.props.members, (email, uid) => {
     return { email, uid };
    });
    return (
      <Modal
        isVisible={this.props.isVisible}
        onBackdropPress={this.props.onBackdropPress}
        animationIn={'zoomInDown'}
        animationOut={'zoomOutUp'}
      >
        <Card containerStyle={styles.modalContent} title="Lista de Invitados">
          <FlatList
            enableEmptySections
            data={members}
            keyExtractor={this.keyExtractor}
            renderItem={this.renderRow}
          />
          <FormLabel>Invite a un colaborador</FormLabel>
          <View style={styles.inviteSection}>
            <TextInput
                style={styles.inviteInput}
                placeholder='Dirección Email'
                onChangeText={(inviteInput) => this.setState({ inviteInput })}
                underlineColorAndroid='transparent'
            />
            <Icon
              style={styles.inviteIcon}
              name='paper-plane'
              type='entypo'
              size={20}
              color="black"
              onPress={() => {
                if (this.state.inviteInput) {
                  this.props.sendInvite(this.state.inviteInput);
                }
              }}
            />
          </View>
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
  inviteSection: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#fff',
  },
  inviteIcon: {
      padding: 10,
  },
  inviteInput: {
      flex: 1,
      paddingTop: 10,
      paddingRight: 10,
      paddingBottom: 10,
      paddingLeft: 0,
      backgroundColor: '#fff',
      color: '#424242',
  },
  listItemsStyle: {
      // flex: 1,
      flexDirection: 'row',
      // justifyContent: 'center',
      // alignItems: 'center',
      // backgroundColor: '#fff',
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

export default ModalCategories;
