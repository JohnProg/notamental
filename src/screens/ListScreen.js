import React, { Component } from 'react';
import { View, FlatList } from 'react-native';
import { connect } from 'react-redux';
import _ from 'lodash';
import { List, ListItem, Avatar } from 'react-native-elements';
import ActionButton from 'react-native-action-button';
import firebase from 'react-native-firebase';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { fetchNotas, notaChanged, deleteNota, inviteNota, editNota } from '../actions';
import ModalOptions from '../components/ModalOptions';

class ListScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Notas',
    tabBarVisible: false,
    headerRight:
      <Icon
        title="Settings"
        size={30}
        onPress={() => navigation.navigate('settings')}
        backgroundColor="rgba(0,0,0,0)"
        color="rgba(0,122,255,1)"
        name='account-settings-variant'
      />,
    headerStyle: {
      paddingRight: 5
    }
  })
  state = {
    isModalVisible: false,
    selectedUid: ''
  }

  componentWillMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (user && !this.props.fetching) {
        this.props.fetchNotas();
      }
    });
  }

  editNota = (nota) => {
    this.handleNavigateRec(nota);
  }

  handleNavigateRec(nota = null) {
    if (nota) {
      this.props.editNota({ nota });
      this.props.navigation.navigate('MainNavigator', {}, {
          type: 'Navigation/NAVIGATE',
          routeName: 'rec',
          params: { type: 'list', title: nota.title }
      });
    } else {
      this.props.navigation.navigate('MainNavigator', {}, {
          type: 'Navigation/NAVIGATE',
          routeName: 'rec',
          params: { type: 'list' }
      });
    }
  }

  keyExtractor(nota) {
    return nota.uid;
  }

  showModal = (selectedNota) => this.setState({ isModalVisible: true, selectedNota })

  hideModal = () => this.setState({ isModalVisible: false })

  handleDelete = () => {
    this.props.deleteNota({ nota: this.state.selectedNota });
    this.hideModal();
  };

  handleInvite = () => {
    this.props.inviteNota({ email: 'alberto@alberto.com', nota: this.state.selectedNota });
  }

  handleBackdropPress() {
    this.setState({ isModalVisible: false });
  }

  // evaluateString(nota) {
  //   if (nota.text[0]) {
  //     return nota.text.join();
  //   } return nota.text;
  // }

  renderSubtitle() {
    if (text.cosntructor === Array) {
      const str = text.map(item => item.val);
      return str.join();
    } return text;
  }


  renderRow = (rowData) => {
    const nota = rowData.item;
    const date = new Date(nota.timestamp);
    return (
      <ListItem
        roundAvatar
        avatar={
          <Avatar
            rounded
            icon={{ name: 'shopping-cart', color: 'white' }}
            overlayContainerStyle={{ backgroundColor: 'green' }}
          />
        }
        avatarStyle={{ flex: 1 }}
        key={nota.uid}
        title={nota.title}
        subtitle={nota.text ? (nota.text.constructor === Array ? nota.text.map(item => item.val).join() : nota.text.val) : null}
        rightTitle={
          `${date.getDate()}/${parseInt(date.getMonth() + 1, 10)}/${date.getFullYear()}\n${date.getHours()}:${(date.getMinutes() < 10 ? '0' : '') + date.getMinutes()}`
        }
        rightTitleNumberOfLines={2}
        onPress={() => this.editNota(nota)}
        onLongPress={() => this.showModal(nota)}
      />
    );
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <List containerStyle={{ marginTop: 0 }}>
          <FlatList
            enableEmptySections
            data={this.props.notas}
            keyExtractor={this.keyExtractor}
            renderItem={this.renderRow}
          />
        </List>
        <ActionButton
          buttonColor="rgba(231,76,60,1)"
          onPress={this.handleNavigateRec.bind(this)}
        />
        <ModalOptions
          onBackdropPress={this.handleBackdropPress.bind(this)}
          isVisible={this.state.isModalVisible}
          deleteNota={this.handleDelete.bind(this)}
          inviteNota={this.handleInvite.bind(this)}
        />
      </View>
    );
  }
}

const mapStateToProps = state => {
  console.log(state.notas);
  const { list, fetching } = state.notas;
  const notas = _.map(list, (val, uid) => {
   return { ...val, uid };
  });
  return { notas, fetching };
};

export default connect(mapStateToProps, {
  fetchNotas,
  notaChanged,
  deleteNota,
  editNota,
  inviteNota
})(ListScreen);
