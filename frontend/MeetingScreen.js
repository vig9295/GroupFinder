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
import EStyleSheet from 'react-native-extended-stylesheet';

var width = Dimensions.get('window').width;

export default class MeetingScreen extends Component {

  constructor(props) {
    super(props);
    this.state = { error: '', data: [] };
    console.log(this.props);
  }

  render() { 
    return (  
      <View style={styles.container}>
        <NavigationBar 
          style={styles.navbar}
          title={this.props.meetingObj.title}
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
        <Text style={styles.navmarginhelper}></Text>
        <Text style={styles.instructions}>Class</Text>
        <Text>{this.props.classObj.name}</Text>
        <Text style={styles.instructions}>Date</Text>
        <Text>{this.props.meetingObj.dateJson}</Text>
        <Text style={styles.instructions}>Location</Text>
        <Text>{this.props.meetingObj.location}</Text>
        <Text style={styles.instructions}>Description</Text>
        <Text>{this.props.meetingObj.description}</Text>

      </View>
    );
  }

  onLeftButtonPress() {
    this.props.navigator.pop();
  }

  onGroupPress() {
    console.log('pressed on a group!');
  }

  onAddGroup() {
    this.props.navigator.push({ 
      screen: 'CreateMeetingScreen',
      passProps: {
        username: this.props.username, 
        classID: this.props.classObj.classID
      }
    });
  }
}

const styles = StyleSheet.create({
  container: {
    //flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    flexDirection: 'column'
  },
  classlist: {
    marginTop: 44
  },
  titletext: {
    fontSize: 24,
    marginTop: 10,
    marginBottom: 10
  },
  classitem: {
    height: 75,
    width: width,
    borderBottomWidth: 3,
    borderColor: '#E0F2F1',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 3,
    backgroundColor: 'white'
  },
  classtext: {
    fontSize: 25
  },
  navmarginhelper: {
  	marginBottom:44
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

AppRegistry.registerComponent('MeetingListScreen', () => MeetingListScreen);