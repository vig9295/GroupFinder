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
  TouchableHighlight,
  Navigator,
} from 'react-native';

import Cookie from 'react-native-cookie';

var width = Dimensions.get('window').width;

export default class LoginScreen extends Component {

  constructor(props) {
    super(props);
    this.state = { error: '', name: '', username: '', password: '' };
  }

  register() {
    var formData = new FormData();
    formData.append('name', this.state.name);
    formData.append('username', this.state.username);
    formData.append('password', this.state.password);
    return fetch('https://group-finder.herokuapp.com//register', 
        {
          method: 'POST',
          body: formData
        }
      )
      .then((response) => response.json())
      .then((responseJson) => {
        if(!responseJson['success'])
          this.setState({ error: responseJson['message'] });
        else {
          this.goLogin();
        }
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
          placeholder="Name"
          onChangeText={(text) => this.setState({ name: text })}
        />
        <TextInput
          style={{height: 50, width: width * .9}}
          placeholder="Username"
          onChangeText={(text) => this.setState({ username: text, error: '' })}
        />
        <TextInput
          style={{height: 50, width: width * .9, marginBottom: 50}}
          placeholder="Password"
          secureTextEntry={true}
          onChangeText={(text) => this.setState({ password: text })}
        />
        <Button
          style={{fontSize: 40}}
          title="Register"
          color="#00695C"
          onPress={this.register.bind(this)}
        />
        <Text> { this.state.error } </Text>
        <TouchableHighlight onPress={this.goLogin.bind(this)}>
          <Text style={styles.instructions}>Already have an account? Login here</Text>
        </TouchableHighlight>
      </View>
    );
  }

  goLogin() {
    this.props.navigator.push({ screen: 'LoginScreen' });
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