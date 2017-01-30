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
  View
} from 'react-native';
import Cookie from 'react-native-cookie';

export default class ClassLoadingScreen extends Component {
  
  componentDidMount() {
    fetch('https://t-square.gatech.edu/direct/site.json')
    .then((response) => response.json())
    .then((responseJson) => {
      var formData = new FormData();
      formData.append('memberID', 'vprasad33');
      formData.append('data', JSON.stringify(responseJson));
      fetch('https://group-finder.herokuapp.com/create_classes', 
        {
          method: 'POST',
          body: formData
        }
      )
      .then((response) => {
      })
      .catch((error) => {
        console.error(error);
      });
    })
    .catch((error) => {
      console.error(error);
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Please wait while your classes are being loaded.
        </Text>
      </View>
    );
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
});

AppRegistry.registerComponent('ClassLoadingScreen', () => ClassLoadingScreen);