import React, { Component } from 'react';
import { TabNavigator, StackNavigator } from 'react-navigation';
import { Provider } from 'react-redux';

import { store } from './store';

import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import RecScreen from './screens/RecScreen';
import ListScreen from './screens/ListScreen';
import ReviewScreen from './screens/ReviewScreen';
import SettingsScreen from './screens/SettingsScreen';


class App extends Component {
  render() {
    const MainNavigator = TabNavigator({
      welcome: { screen: WelcomeScreen },
      auth: {
        screen: StackNavigator({
          login: { screen: LoginScreen },
          register: { screen: RegisterScreen },
        })
      },
      main: {
        screen: StackNavigator({
          list: { screen: ListScreen },
          rec: { screen: RecScreen },
          settings: { screen: SettingsScreen },
          review: {
            screen: StackNavigator({
              review: { screen: ReviewScreen }
            })
          },
        },
        {
            lazyLoad: true,
            swipeEnabled: false,
        })
      }
    }, {
      navigationOptions: {
        tabBarVisible: false
      },
      swipeEnabled: false,
      lazyLoad: true
    });

    return (
      <Provider store={store}>
        <MainNavigator />
      </Provider>
    );
  }
}

export default App;
