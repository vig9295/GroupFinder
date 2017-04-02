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

import EStyleSheet from 'react-native-extended-stylesheet';

import LoginScreen from './LoginScreen'
import RegisterScreen from './RegisterScreen'
import ClassListScreen from './ClassListScreen'
import MeetingListScreen from './MeetingListScreen'
import GatechLoginScreen from './GatechLoginScreen'
import ClassLoadingScreen from './ClassLoadingScreen'
import CreateMeetingScreen from './CreateMeetingScreen'
import EditGroupScreen from './EditGroupScreen'
import MeetingScreen from './MeetingScreen'
import MeetingPreviewScreen from './MeetingPreviewScreen'
import ChatScreen from './ChatScreen'

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
      case 'MeetingListScreen':
        return <MeetingListScreen navigator={nav} {...route.passProps}/>
      case 'GatechLoginScreen':
        return <GatechLoginScreen navigator={nav} />
      case 'ClassLoadingScreen':
        return <ClassLoadingScreen navigator={nav} />
      case 'CreateMeetingScreen':
        return <CreateMeetingScreen navigator={nav} {...route.passProps}/>
      case 'MeetingScreen':
        return <MeetingScreen navigator={nav} {...route.passProps}/>
      case 'MeetingPreviewScreen':
        return <MeetingPreviewScreen navigator={nav} {...route.passProps}/>
      case 'ChatScreen':
        return <ChatScreen navigator={nav} {...route.passProps}/>
      case 'EditGroupScreen':
        return <EditGroupScreen navigator={nav} />
      }
  }
}

AppRegistry.registerComponent('GroupFinder', () => GroupFinder);
