import React, { Component } from 'react';
import { View, Text, Image, Dimensions } from 'react-native';
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

  renderLogoImage(img) {
    if (img) {
      return (
        <Image
          style={{ alignSelf: 'center', marginTop: 15 }}
          source={img}
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
          <Text style={{ ...styles.textStyle, color: slide.textColor }}>{slide.text}</Text>
          {this.renderLogoImage(slide.img)}
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
          activeDot={'black'}
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
    textAlign: 'center',
  },
  buttonStyle: {
    marginTop: 25,
    backgroundColor: 'black'
  }
};

export default Slides;
