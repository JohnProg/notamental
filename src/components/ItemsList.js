import React, { Component } from 'react';
import { View, Text, TextInput, ScrollView } from 'react-native';
import { List, ListItem, FormInput, Icon, Card } from 'react-native-elements';
import { DotsLoader } from 'react-native-indicator';
import Swipeable from 'react-native-swipeable';

class ItemsList extends Component {
  state = {
    onChange: '',
    onKey: '',
    postText: '',
    items: [],
    position: '',
    inputHeight: 0
  }

  componentWillMount() {
  }

  onChangeItem(value) {
    this.setState({ onChange: value });
  }

  onKeyItem(value) {
    console.log('onKeyItem: ', value);
  }

  addTextInput(index, text = '') {
    const { items } = this.props;
    items.splice(index, 0, text);
    this.props.onChangeText({ prop: 'text', value: items });
    this.setState({ items });
  }

  handleSizeChange(event) {
    this.setState({
      inputHeight: event.nativeEvent.contentSize.height
    });
  }

  renderIcon(i) {
    if (this.props.onFocus === i) {
      return (
        <View style={{ marginRight: 15 }}>
          <DotsLoader />
        </View>
      );
    } return (
        <Icon
          style={styles.iconListStyle}
          title="dot"
          size={28}
          name='dot-single'
          type='entypo'
        />);
  }

  renderList(text) {
    if (text[text.length - 1]) {
      text.push('');
    }
    return text.map((item, i) => (
      <Swipeable
        key={i}
        rightContent={<Text>otraadasdas</Text>}
      >
        <View key={i} style={styles.listItemsStyle}>
          {this.renderIcon(i)}
          <TextInput
            multiline
            ref={i}
            placeholder='Item'
            returnKeyType="next"
            style={[styles.inputStyle, { height: Math.max(35, this.state.inputHeight) }]}
            fontSize={18}
            clearButtonMode='always'
            underlineColorAndroid='transparent'
            containerStyle={{ marginLeft: 0 }}
            defaultValue={item}
            blurOnSubmit
            onContentSizeChange={(event) => this.handleSizeChange(event)}
            onSelectionChange={(event) =>
              this.setState({ position: event.nativeEvent.selection.start })}
            onChangeText={value => {
              const newItems = text;
              newItems[i] = value;
              if (!value && (i !== 0)) {
                newItems.splice(i, 1);
                this.refs[i - 1].focus();
              }
              this.props.onChangeText({ prop: 'text', value: newItems });
            }}
            onSubmitEditing={(event) => {
              const initText = event.nativeEvent.text;
              const newItems = text;
              newItems[i] = initText.substring(0, this.state.position);
              this.props.onChangeText({
                prop: 'text',
                value: newItems
              });
              this.addTextInput(i + 1, initText.substring(this.state.position));
              this.refs[(i + 1)].focus();
            }}
          />
        </View>
      </Swipeable>));
  }


  render() {
    const list = ['', ''];
    return (
      <ScrollView>
        <Card
          containerStyle={{ marginTop: 10, minHeight: 300 }}
        >
          {this.props.items[0] ?
            this.renderList(this.props.items) : this.renderList(list)}
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
