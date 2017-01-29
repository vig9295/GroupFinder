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
  TextInput,
  Button,
  Image,
  View,
  Dimensions,
  Navigator,
  TouchableHighlight
} from 'react-native';

var width = Dimensions.get('window').width;

export default class LoginScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {error: 'ERROR BRUH'};
  }

  fetchError() {
    return fetch('https://group-finder.herokuapp.com/')
      .then((response) => response.json())
      .then((responseJson) => {
        console.log("HMMM");
        this.setState({ error: responseJson.hello});
      })
      .catch((error) => {
        console.error(error);
      });
  }

  render() { 
    return (
      <View style={styles.container}>
        <TextInput
          style={{height: 50, width: width * .9}}
          placeholder="Username"
          onChangeText={(text) => this.setState({text})}
        />
        <TextInput
          style={{height: 50, width: width * .9, marginBottom: 50}}
          placeholder="Password"
          secureTextEntry={true}
          onChangeText={(text) => this.setState({text})}
        />
        <Button
          style={{fontSize: 40}}
          title="Login"
          color="#00695C"
          onPress={this.fetchError.bind(this)}
        />
        <Text> { this.state.error } </Text>
        <TouchableHighlight onPress={this.goRegister.bind(this)}>
          <Text style={styles.instructions}>Don't have an account? Register here</Text>
        </TouchableHighlight>
      </View>
    );
  }

  goRegister() {
    this.props.navigator.push({ screen: 'RegisterScreen' });
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