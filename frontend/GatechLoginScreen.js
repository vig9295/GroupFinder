import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  WebView
} from 'react-native';

export default class GatechLoginScreen extends Component {
  render() {
    return (
      <WebView
        source={{uri: 'https://login.gatech.edu/cas/login?service=https%3A%2F%2Ft-square.gatech.edu%2Fsakai-login-tool%2Fcontainer'}}
        style={{marginTop: 20}}
        onNavigationStateChange={this.whenNavigationStateChanges.bind(this)}
      />
    );
  }

  whenNavigationStateChanges(navState){
    if(navState.url.includes('t-square.gatech.edu')) {
      this.props.navigator.push({ screen: 'ClassLoadingScreen' });
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('GatechLoginScreen', () => GatechLoginScreen);