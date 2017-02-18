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
  ListView,
  View,
  Dimensions,
  Navigator,
  TouchableHighlight
} from 'react-native';

import Cookie from 'react-native-cookie';
import NavigationBar from 'react-native-navigation-bar';

var width = Dimensions.get('window').width;

export default class ClassListScreen extends Component {

  constructor(props) {
    super(props);
    this.state = { error: '', data: [] };
  }

  render() { 
    let listData = null
    if (this.state.data.length == 0) {
      listData = (
        <TouchableHighlight onPress={this.onAddGroup.bind(this)}>
          <Text style={styles.instructions}>You have no groups for this class. Press here to make one!</Text>
        </TouchableHighlight>
      );
    }

    return (  
      <View style={styles.container}>
        <NavigationBar 
          style={styles.navbar}
          title={'Group List'}
          height={44}
          titleColor={'#fff'}
          backgroundColor={'#004D40'}
          leftButtonTitle={'Back'}
          leftButtonTitleColor={'#fff'}
          onLeftButtonPress={this.onLeftButtonPress.bind(this)}
          rightButtonTitle={'Add'}
          rightButtonTitleColor={'#fff'}
          onRightButtonPress={this.onAddGroup.bind(this)}
        />
        { listData }
      </View>
    );
  }

  goGatechLogin() {
    this.props.navigator.push({ screen: 'GatechLoginScreen' });
  }

  onLeftButtonPress() {
    this.props.navigator.pop();
  }

  onGroupPress() {
    console.log('pressed on a group!');
  }

  onAddGroup() {
    this.props.navigator.push({ screen: 'CreateGroupScreen' });
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  classlist: {
    marginTop: 44
  },
  classitem: {
    height: 75,
    width: width,
    borderBottomWidth: 3,
    borderColor: '#E0F2F1',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white'
  },
  classtext: {
    fontSize: 25
  },
  navbar: {
    //and here's where I would put my styles
    //  iF I HAD ONE
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

AppRegistry.registerComponent('ClassListScreen', () => ClassListScreen);