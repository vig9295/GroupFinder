/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component, PropTypes } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  TextInput,
  Button,
  Image,
  View,
  Dimensions,
  Navigator
} from 'react-native';

var width = Dimensions.get('window').width;

export default class RegisterScreen extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Image 
          style={{
            marginBottom: 50
          }}
          source={require('./img/logo.png')}
        />
        <TextInput
          style={{height: 50, width: width * .9}}
          placeholder="Username"
          onChangeText={(text) => this.setState({text})}
        />
        <TextInput
          style={{height: 50, width: width * .9}}
          placeholder="Password"
          secureTextEntry={true}
          onChangeText={(text) => this.setState({text})}
        />
        <TextInput
          style={{height: 50, width: width * .9, marginBottom: 50}}
          placeholder="Confirm Password"
          secureTextEntry={true}
          onChangeText={(text) => this.setState({text})}
        />
        <Button
          style={{fontSize: 40}}
          title="Register"
          color="#00695C"
        />
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
  instructions: {
    marginTop: 15,
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});