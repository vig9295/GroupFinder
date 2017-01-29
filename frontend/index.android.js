/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  WebView
} from 'react-native';

class GroupFinder extends Component {
  render() {
    return (
      <WebView
        source={{uri: 'http://m.gatech.edu/w/schedule/c/'}}
        style={{marginTop: 20}}
      />
    );
  }
}

AppRegistry.registerComponent('GroupFinder', () => GroupFinder);
