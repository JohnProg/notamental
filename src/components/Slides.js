import React, { Component } from 'react';
import { View, Text, ScrollView, Dimensions } from 'react-native';
import { Button } from 'react-native-elements';
import Swiper from 'react-native-swiper';

const SCREEN_WIDTH = Dimensions.get('window').width;

class Slides extends Component {

  constructor(props) {
   super(props);
   this.state = {
      visibleSwiper: false
   };
  }

  componentDidMount() {
     setTimeout(() => {
        this.setState({
          visibleSwiper: true
        });
     }, 100);
  }

  renderLastSlide(index) {
    if (index === this.props.data.length - 1) {
      return (
        <Button
          buttonStyle={styles.buttonStyle}
          fontsize='30'
          title="Comenzar!"
          large
          onPress={this.props.onComplete}
        />
      );
    }
  }

  renderSlides() {
    return this.props.data.map((slide, index) => {
      return (
        <View
          key={slide.text}
          style={[styles.slideStyle, { backgroundColor: slide.color }]}
        >
          <Text style={styles.textStyle}>{slide.text}</Text>
          {this.renderLastSlide(index)}
        </View>
      );
    });
  }

  renderSwiper() {
    if (this.state.visibleSwiper) {
      return (
        <Swiper
          style={styles.wrapper}
          showsButtons
          removeClippedSubviews={false}
        >
          {this.renderSlides()}
        </Swiper>
      );
    } return <View />;
  }

  render() {
    if (this.state.visibleSwiper) {
      return (
        <Swiper
          loop={false}
          style={styles.wrapper}
          showsButtons
          removeClippedSubviews={false}
        >
          {this.renderSlides()}
        </Swiper>
      );
    } return <View />;
  }
}

const styles = {
  wrapper: {
  },
  slideStyle: {
    width: SCREEN_WIDTH,
    flex: 1,
    //flexDirection: 'column',
    justifyContent: 'center',
    //alignItems: 'center',

  },
  textStyle: {
    fontSize: 30,
    color: 'white',
    textAlign: 'center',
  },
  buttonStyle: {
    marginTop: 25,
    backgroundColor: '#0288D1'
  }
};

export default Slides;
