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
import GroupListScreen from './GroupListScreen'
import GatechLoginScreen from './GatechLoginScreen'
import ClassLoadingScreen from './ClassLoadingScreen'
import CreateGroupScreen from './CreateGroupScreen'
import EditGroupScreen from './EditGroupScreen'

export default class GroupFinder extends Component {
  
  render() {
    return (
      <Navigator
        initialRoute={{screen: 'ClassListScreen'}}
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
      case 'GroupListScreen':
        return <GroupListScreen navigator={nav} passProps={route.passProps}/>
      case 'GatechLoginScreen':
        return <GatechLoginScreen navigator={nav} />
      case 'ClassLoadingScreen':
        return <ClassLoadingScreen navigator={nav} />
      case 'CreateGroupScreen':
        return <CreateGroupScreen navigator={nav} />
      case 'EditGroupScreen':
        return <EditGroupScreen navigator={nav} />
      }
  }
}

AppRegistry.registerComponent('GroupFinder', () => GroupFinder);
