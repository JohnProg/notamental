import React from 'react';
import { View } from 'react-native';

const CardSection = (props) => {
  return (
    <View style={[styles.constainerStyle, props.style]}>
      {props.children}
    </View>
  );
};

const styles = {
  constainerStyle: {
    borderBottomWidth: 1, //a little bit of border
    padding: 5, //space between content and border
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    borderColor: '#ddd',
    position: 'relative'
  }
};

export { CardSection };
