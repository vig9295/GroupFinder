/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  Navigator,
} from 'react-native';

import LoginScreen from './LoginScreen'
import RegisterScreen from './RegisterScreen'
import ClassListScreen from './ClassListScreen'


export default class GroupFinder extends Component {
  
  render() {
    return (
      <Navigator
        initialRoute={{screen: 'LoginScreen'}}
        renderScene={(route, nav) => {return this.renderScene(route, nav)}}
      />
    )
  }

  renderScene(route, nav) {
    switch (route.screen) {
      case 'LoginScreen':
        return <LoginScreen navigator={nav} />
      case 'RegisterScreen':
        return <RegisterScreen navigator={nav} />
      case 'ClassListScreen':
        return <ClassListScreen navigator={nav} />
      }
  }
}

AppRegistry.registerComponent('GroupFinder', () => GroupFinder);
