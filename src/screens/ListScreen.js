import React, { Component } from 'react';
import { View, FlatList } from 'react-native';
import { connect } from 'react-redux';
import _ from 'lodash';
import { List, ListItem, Avatar } from 'react-native-elements';
import ActionButton from 'react-native-action-button';
import firebase from 'react-native-firebase';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { fetchNotas, notaChanged } from '../actions';

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

  componentWillMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.props.fetchNotas({ user });
      }
    });
  }

  editNota = (nota) => {
    this.props.notaChanged({ prop: 'title', value: nota.title });
    this.props.notaChanged({ prop: 'text', value: nota.text });
    this.props.navigation.navigate('rec');
  }

  keyExtractor(nota) {
    return nota.uid;
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
          onPress={() => this.props.navigation.navigate('rec')}
        />
      </View>
    );
  }
}

const mapStateToProps = state => {
  const notas = _.map(state.notas, (val, uid) => {
   return { ...val, uid };
  });
  return { notas };
};

export default connect(mapStateToProps, { fetchNotas, notaChanged })(ListScreen);
