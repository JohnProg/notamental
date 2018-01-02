import React, { Component } from 'react';
import Slides from '../components/Slides';
import { SLIDE_DATA } from '../utils/slidedata';


class WelcomeScreen extends Component {
  // static navigationOptions = {
  //   title: 'Welcome',
  //   tabBarLabel: 'ScreenOne',
  //   tabBarIcon: ({ tintColor }) => (
  //     <Image style={[{ flex: 1 }, { tintColor }]} />
  //   )
  // }
  onSlidesComplete = () => {
    this.props.navigation.navigate('auth');
  }

  render() {
    console.log(SLIDE_DATA);
    return (
      <Slides
        data={SLIDE_DATA}
        onComplete={this.onSlidesComplete}
      />
    );
  }
}

export default WelcomeScreen;
