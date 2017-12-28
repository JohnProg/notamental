import React, { Component } from 'react';
import { View, Text, TextInput, ScrollView } from 'react-native';
import { List, ListItem, FormInput, Icon, Card } from 'react-native-elements';
import { DotsLoader } from 'react-native-indicator';
import Swipeable from 'react-native-swipeable';

const INITIAL_STATE = {
  val: '',
  style: {
    flex: 1,
    paddingTop: 0,
    paddingRight: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    backgroundColor: '#fff',
    color: '#424242'
  }
};

class ItemsList extends Component {
  state = {
    onChange: '',
    onKey: '',
    postText: '',
    items: [],
    position: '',
    strikeStyle: ''
  }

  componentWillMount() {
  }

  componentDidMount() {
  }

  onChangeItem(value) {
    this.setState({ onChange: value });
  }

  onKeyItem(value) {
    console.log('onKeyItem: ', value);
  }

  onRightActionRelease(i) {
    const { items } = this.props;
    items[i].style = { textDecorationLine: 'line-through' };
    this.props.onChangeText({ prop: 'text', value: items });
  }

  addTextInput(index, text = '') {
    const { items } = this.props;
    items.splice(index, 0, !text ? { val: ' ', spaceOffset: true } : { val: text });
    this.props.onChangeText({ prop: 'text', value: items });
    this.setState({ items });
  }

  handleSizeChange(event, i) {
    const { items } = this.props;
    const { height } = event.nativeEvent.contentSize;
    items[i].style = { height: Math.max(35, height) };
    this.props.onChangeText({ prop: 'text', value: items });
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
          color={i === this.props.items.length - 1 ? '#a9a9a9' : 'black'}
        />);
  }

  renderRightContent() {
    return (
      <Icon
        title="check"
        size={28}
        name='check'
        type='entypo'
      />
    );
  }

  renderPlaceholder(i) {
    const { items } = this.props;
    if (i === items.length - 1) {
      return 'Añadir Item';
    } return '';
  }

  renderList(text) {
    if (text[text.length - 1].val !== '' || text.length === 1) {
      text.push({ val: '' });
    }
    return text.map((item, i) => (
      <Swipeable
        key={i}
        rightContent={this.renderRightContent()}
        onRightActionRelease={() => this.onRightActionRelease(i)}
      >
        <View key={i} style={styles.listItemsStyle}>
          {this.renderIcon(i)}
          <TextInput
            multiline
            ref={i}
            placeholder={this.renderPlaceholder(i)}
            returnKeyType="next"
            style={[
              { ...styles.inputStyle }, item.style]}
            fontSize={18}
            clearButtonMode='always'
            underlineColorAndroid='transparent'
            containerStyle={{ marginLeft: 0 }}
            defaultValue={item.val}
            blurOnSubmit
            onFocus={() => {
              if (i === 0 && text.length === 0) text.push('');
              //this.props.onChangeText({ prop: 'position', value: -1 });
              this.props.onChangeText({ prop: 'focused', value: i });
            }}
            onContentSizeChange={(event) => this.handleSizeChange(event, i)}
            onSelectionChange={(event) => {
              const { start } = event.nativeEvent.selection;
              this.props.onChangeText({ prop: 'position', value: start });
              this.setState({ position: start });
            }}
            onChangeText={value => {
              const newItems = text;
              if (newItems[i].spaceOffset) {
                newItems[i].val = value.trim();
                newItems[i].spaceOffset = false;
              } else {
                newItems[i].val = value;
              }
              if (!value && (i !== 0)) {
                newItems.splice(i, 1);
                this.refs[i - 1].focus();
              }
              this.props.onChangeText({ prop: 'text', value: newItems });
            }}
            onSubmitEditing={(event) => {
              const initText = event.nativeEvent.text;
              const newItems = text;
              newItems[i].val = initText.substring(0, this.props.position);
              if (!newItems[i].val) {
                newItems[i].val = ' ';
              }
              this.props.onChangeText({
                prop: 'text',
                value: newItems
              });
              this.addTextInput(i + 1, initText.substring(this.props.position));
              this.refs[(i + 1)].focus();
              this.props.onChangeText({ prop: 'position', value: 0 });
            }}
          />
        </View>
      </Swipeable>));
  }


  render() {
    return (
      <ScrollView>
        <Card
          containerStyle={{ marginTop: 10, minHeight: 300 }}
        >
          {this.renderList(this.props.items)}
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
      color: '#424242'
  },
};

export default ItemsList;
