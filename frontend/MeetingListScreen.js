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

export default class MeetingListScreen extends Component {

  constructor(props) {
    super(props);
    this.state = { error: '', data: [] };
  }

  componentDidMount() {
    var formData = new FormData();
    formData.append('memberID', this.props.username);
    url = 'https://group-finder.herokuapp.com/class/' + this.props.classObj.classID + '/meetings';
    fetch(url, {
      method: 'POST',
      body: formData
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if(responseJson['success']) {
        if(responseJson['data'].length > 0) {
          const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
          this.setState({
            data: ds.cloneWithRows(responseJson['data'])
          });
        }
      }
      else {
        this.setState({ error: responseJson['message'] });
      }
    })
    .catch((error) => {
      console.error(error);
    });
    fetch('https://group-finder.herokuapp.com/class/' + this.props.classObj.classID + '/members')
      .then((response) => response.json())
      .then((responseJson) => {
        if(responseJson['success']) {
          if(responseJson['data'].length > 0) {
            this.setState({ classMembers : responseJson['data'] });
          }
        }
        else {
          this.setState({ error: responseJson['message'] });
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  render() { 

    let listData = null
    if (this.state.data.length == 0) {
      listData = (
        <TouchableHighlight onPress={this.onAddGroup.bind(this)}>
          <Text style={styles.instructions}>You have no groups for this class. Press here to make one!</Text>
        </TouchableHighlight>
      );
    } else {
      listData = (
        <ListView style={styles.classlist}
        dataSource={this.state.data}
        renderRow={(rowData) => 
          <TouchableHighlight style={styles.classitem} onPress={() => this.onMeetingPress(rowData)}>
            <Text style={styles.classtext}>{rowData['title']}</Text>
          </TouchableHighlight>
        } />
      );
    }
    var studentList = this.state.classMembers.map(function(student) {
      return <Text style={styles.smallListItem} key={student.memberID}>{student.name}</Text>
    });
    return (  
      <View style={styles.container}>
        <NavigationBar 
          style={styles.navbar}
          title={'Meeting List'}
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
        <Text style={styles.titletext}>Your Meetings</Text>
        { listData }
        <Text style={styles.titletext}>Available Meetings</Text>
        <TouchableHighlight style={styles.classitem} >
          <Text style={styles.classtext}>a meeting you arent a part of</Text>
        </TouchableHighlight>
        <Text style={styles.titletext}>Class Members</Text>
        { studentList }
      </View>
    );
  }

  onLeftButtonPress() {
    this.props.navigator.pop();
  }

  onMeetingPress(meetingObj) {
    this.props.navigator.push({ 
      screen: 'MeetingScreen',
      passProps: {
        username: this.state.username,
        meetingObj: meetingObj,
        classObj: this.props.classObj
      } 
    });
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
  titletext: {
    fontSize: 22,
    marginTop: 10,
    marginBottom: 10
  },
  smallListItem: {
    width: width,
    borderBottomWidth: 1,
    borderColor: '#E0F2F1',
    justifyContent: 'center',
    paddingLeft: 10,
    paddingTop: 5,
    paddingBottom: 5,
    alignItems: 'center',
    borderTopWidth: 1,
    backgroundColor: 'white'
  },
  navmarginhelper: {
    marginBottom:40
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