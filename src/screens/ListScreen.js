import React, { Component } from 'react';
import { View, FlatList } from 'react-native';
import { connect } from 'react-redux';
import _ from 'lodash';
import { List, ListItem, Avatar } from 'react-native-elements';
import ActionButton from 'react-native-action-button';
import firebase from 'react-native-firebase';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { fetchNotas, notaChanged, deleteNota, inviteNota } from '../actions';
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
      if (user) {
        this.props.fetchNotas();
      }
    });
  }

  editNota = (nota) => {
    this.handleNavigateRec(nota, { showShare: true });
  }

  handleNavigateRec(nota = null, showShare = false) {
    this.props.navigation.navigate('MainNavigator', {}, {
        type: 'Navigation/NAVIGATE',
        routeName: 'rec',
        params: { nota, showShare }
    });
  }

  keyExtractor(nota) {
    return nota.uid;
  }

  showModal = (selectedNota) => this.setState({ isModalVisible: true, selectedNota })

  hideModal = () => this.setState({ isModalVisible: false })

  handleDelete = () => {
    this.props.deleteNota({ nota: this.state.selectedNota, navigation: this.props.navigation });
    this.hideModal();
  };

  handleInvite = () => {
    this.props.inviteNota({ email: 'alberto@alberto.com', nota: this.state.selectedNota });
  }

  handleBackdropPress() {
    this.setState({ isModalVisible: false });
  }


  renderRow = (rowData) => {
    const nota = rowData.item;
    return (
      <ListItem
        roundAvatar
        avatar={
          <Avatar
            // small
            rounded
            icon={{ name: 'shopping-cart', color: 'white' }}
            overlayContainerStyle={{ backgroundColor: 'green' }}
            // activeOpacity={0.7}
            // containerStyle={{ flex: 2, marginLeft: 20, marginTop: 115 }}
          />
        }
        avatarStyle={{ flex: 1 }}
        key={nota.uid}
        title={nota.title}
        subtitle={nota.text}
        rightTitle={nota.timestamp}
        // label={'prueba'}
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
  console.log('mapstateToprops', state);
  // if (_.isEmpty(state.nota)
  const notas = _.map(state.notas, (val, uid) => {
   return { ...val, uid };
  });
  return { notas };
};

export default connect(mapStateToProps, {
  fetchNotas,
  notaChanged,
  deleteNota,
  inviteNota
})(ListScreen);
