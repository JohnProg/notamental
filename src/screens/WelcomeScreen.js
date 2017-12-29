import React, { Component } from 'react';
import Slides from '../components/Slides';

const SLIDE_DATA = [
  { text: 'Bienvenida/o a\nNota Mental', color: '#e4e574' },
  { text: 'Puedes guardar aquí tus notas de voz', color: '#009688' },
  { text: 'Y ese audio se convertirá en texto!', color: '#03A9F4' }
];

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
    return (
      <Slides
        data={SLIDE_DATA}
        onComplete={this.onSlidesComplete}
      />
    );
  }
}

export default WelcomeScreen;
