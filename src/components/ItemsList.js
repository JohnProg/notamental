import React, { Component } from 'react';
import { View, Text, TextInput, ScrollView } from 'react-native';
import { List, ListItem, FormInput, Icon, Card } from 'react-native-elements';
import Swipeable from 'react-native-swipeable';

class ItemsList extends Component {
  renderList(text) {
    return text.map((item, i) => (
      <Swipeable
        key={i}
        rightContent={<Text>otraadasdas</Text>}
      >
        <View key={i} style={styles.listItemsStyle}>
          <Icon
            style={styles.iconListStyle}
            title="dot"
            size={28}
            name='dot-single'
            type='entypo'
          />
          <TextInput
            style={styles.inputStyle}
            value={item}
            fontSize={18}
            underlineColorAndroid='transparent'
            containerStyle={{ marginLeft: 0 }}
          />
        </View>
      </Swipeable>));
  }

  renderItem(text) {
    return (
      <Swipeable
        onMoveShouldSetPanResponder={this.onMoveShouldSetPanResponder}
        rightContent={<Text>otraadasdas</Text>}
      >
        <View style={{ flexDirection: 'row' }}>
          <Icon
            title="dot"
            size={28}
            name='dot-single'
            type='entypo'
          />
          <Text>
          <TextInput
            value={text}
            fontSize={18}
            underlineColorAndroid='transparent'
            containerStyle={{ marginLeft: 0 }}
          />
          </Text>
        </View>
      </Swipeable>
    );
  }

  render() {
    const initialList = ['Patatas', 'Manzanas', 'Zanahoria', '...', 'Manzanas', 'Zanahoria', '...', 'Manzanas', 'Zanahoria', '...'];
    const { items } = this.props;
    return (
      <ScrollView>
        <Card
          containerStyle={{ marginTop: 10, minHeight: 300 }}
        >
          {(items) ? this.renderItem(items) : this.renderList(initialList)}
        </Card>
      </ScrollView>
    );
  }
}

const styles = {
  listItemsStyle: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#fff',
  },
  iconListStyle: {
      padding: 0,
  },
  inputStyle: {
      flex: 1,
      paddingTop: 0,
      paddingRight: 0,
      paddingBottom: 0,
      paddingLeft: 0,
      backgroundColor: '#fff',
      color: '#424242',
  },
};

export default ItemsList;
