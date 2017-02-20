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
  
  constructor(props) {
    super(props);
    var formData = new FormData();
    fetch('https://t-square.gatech.edu/direct/site.json')
    .then((response) => response.json())
    .then((responseJson) => {
      formData.append('data', JSON.stringify(responseJson));
      var hmm = Cookie.get('hmm', 'username')
      .then((cookie) => {
        formData.append('memberID', cookie);
        fetch('https://group-finder.herokuapp.com/create_classes', 
          {
            method: 'POST',
            body: formData
          }
        )
        .then((response) => response.json())
        .then((responseJson) => {
          console.log(responseJson)
          if(responseJson['success']) {
            this.props.navigator.push({ screen: 'ClassListScreen' });
          }
        })
        .catch((error) => {
          console.error(error);
        });
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