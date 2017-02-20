import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  WebView
} from 'react-native';

export default class GatechLoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = { shouldRender: true };
  } 

  render() {
    if (this.state.shouldRender) {
      return (
        <WebView
          source={{uri: 'https://login.gatech.edu/cas/login?service=https%3A%2F%2Ft-square.gatech.edu%2Fsakai-login-tool%2Fcontainer'}}
          style={{marginTop: 20}}
          onNavigationStateChange={this.whenNavigationStateChanges.bind(this)}
        />
      );
    } else {
      return ( 
        <View />
      );
    }
  }

  whenNavigationStateChanges(navState){
    if(navState.url.includes('t-square.gatech.edu/portal')) {
      this.setState({ shouldRender: false });
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
