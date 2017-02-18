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
import NavigationBar from 'react-native-navigation-bar';
import DatePicker from 'react-native-datepicker';

var width = Dimensions.get('window').width;

export default class CreateGroupScreen extends Component {

  constructor(props){
    super(props)
    this.state = {groupname: '', location: '', date: new Date()}
  }

  render() { 
    return (
      <View style={styles.container}>
        <NavigationBar 
          style={styles.navbar}
          title={'Create Group'}
          height={44}
          titleColor={'#fff'}
          backgroundColor={'#004D40'}
          leftButtonTitle={'Back'}
          onLeftButtonPress={this.onLeftPress.bind(this)}
          leftButtonTitleColor={'#fff'}
          rightButtonTitle={'Create'}
          rightButtonTitleColor={'#fff'}
        />
        <TextInput
          style={{height: 50, width: width * .9}}
          placeholder="Group Name"
          onDateChange={(groupname) => {this.setState({groupname: groupname})}}
        />
        <TextInput
          style={{height: 50, width: width * .9, marginBottom: 30}}
          placeholder="Location"
          onDateChange={(location) => {this.setState({location: location})}}
        />
        <Text>Meeting Time</Text>
        <DatePicker
          style={{height: 50, width: width * .9}}
          date={this.state.date}
          mode="datetime"
          placeholder="select date"
          format="YYYY-MM-DD HH:MM"
          minDate={this.state.date}
          maxDate={this.state.date}
          confirmBtnText="Confirm"
          cancelBtnText="Cancel"
          customStyles={{
            dateIcon: {
              position: 'absolute',
              left: 0,
              top: 4,
              marginLeft: 0
            },
            dateInput: {
              marginLeft: 36
            }
          }}
          onDateChange={(date) => {this.setState({date: date})}}
        />
        {/*I'm really not sure what to put here, since its not clear to me how to 
        get the database of students/which ones we should filter yet (friends? people in class?)*/}
        <TextInput
          style={{height: 50, width: width * .9, marginBottom: 30}}
          placeholder="Invitees"
        />
      </View>
    );
  }

  onLeftPress() {
    this.props.navigator.pop();
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