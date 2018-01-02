import React, { Component } from 'react';
import { FlatList } from 'react-native';
import Modal from 'react-native-modal';
import { Card, ListItem, Avatar } from 'react-native-elements';

class ModalCategories extends Component {
  renderRow = (rowData) => {
    const category = rowData.item;
    return (
      <ListItem
        roundAvatar
        leftIcon={{ name: category.key, type: 'entypo', color: 'black' }}
        key={category.key}
        title={category.label}
        onPress={() => this.props.onPressCategory(category)}
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
        <Card containerStyle={styles.modalContent} title="Escoge una categoría">
          <FlatList
            enableEmptySections
            data={this.props.categories}
            keyExtractor={this.keyExtractor}
            renderItem={this.renderRow}
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
