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
import { Card, CheckboxGroup } from 'react-native-material-design'; 
import Cookie from 'react-native-cookie';
import NavigationBar from 'react-native-navigation-bar';
import DatePicker from 'react-native-datepicker';

var width = Dimensions.get('window').width;

export default class CreateMeetingScreen extends Component {

  constructor(props){
    super(props)
    this.state = {
      meetingName: '',
      location: '',
      date: new Date(),
      classMembers: [],
      description: '',
      showMembers: false,
      members: [],
      error: ''
    }
    url = 'https://group-finder.herokuapp.com/class/' + this.props.classID + '/members';
    fetch(url)
    .then((response) => response.json())
    .then((responseJson) => {
      if(responseJson['success']) {
        if(responseJson['data'].length > 0) {
          var data = responseJson['data'];
          classMembers = []
          for (var i = 0; i < data.length; i++) {
            if(data[i].memberID != this.props.username) {
              classMembers.push({ 
                value: data[i]['memberID'],
                label: data[i]['name']
              });
            }
          }
          this.setState({ classMembers : classMembers });
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

  onCreateMeeting() {
    console.log(this.state)
    if(this.state.groupName == '') {
      this.setState({error: 'Please enter a valid group name'})
      return
    } else if(this.state.location == '') {
      this.setState({error: 'Please enter a valid locaiton'})
      return
    } else if(this.state.description == '') {
      this.setState({error: 'Please enter a valid description'})
      return
    } else if(this.state.date == new Date()) {
      this.setState({error: 'Please select a valid date'})
      return
    }
    var formData = new FormData();
    formData.append('classID', this.props.classID);
    formData.append('title', this.state.meetingName);
    formData.append('location', this.state.location);
    formData.append('description', this.state.description);
    formData.append('date', this.state.date.toString());
    formData.append('owner', this.props.username);
    members = this.state.members;
    members.push(this.props.username);
    formData.append('memberList', JSON.stringify(members));
    url = 'http://128.61.61.119:5000/create_meetings'
    fetch(url, 
      {
        method: 'POST',
        body: formData
      }
    )
    .then((response) => response.json())
    .then((responseJson) => {
      if(!responseJson['success']) {
        this.setState({ error: responseJson['message'] });
      } else {
        this.props.navigator.pop()
      }
    })
    .catch((error) => {
      console.error(error);
    });
  }

  render() { 
    inviteeSelection = null;
    if (this.state.showMembers) {
      return (
        <Card style={{ height: 550, width: 343, zIndex: 100 }} >
          <Card.Body>
            <View>
              <CheckboxGroup
                onSelect={(values) => this.setState({ members: values})}
                items={this.state.classMembers}
              />
              <Button
                style={{fontSize: 40}}
                title="Done"
                onPress={() => this.setState({showMembers: false})}
              />
            </View>
          </Card.Body>
        </Card>
      )
    }
    return (
      <View style={styles.container}>
        <NavigationBar 
          style={styles.navbar}
          title={'Create Meeting'}
          height={44}
          titleColor={'#fff'}
          backgroundColor={'#004D40'}
          leftButtonTitle={'Back'}
          onLeftButtonPress={this.onLeftPress.bind(this)}
          leftButtonTitleColor={'#fff'}
          rightButtonTitle={'Create'}
          onRightButtonPress={this.onCreateMeeting.bind(this)}
          rightButtonTitleColor={'#fff'}
        />
        <TextInput
          style={{height: 50, width: width * .9}}
          placeholder="Meeting Name"
          value={this.state.meetingName}
          onChangeText={(meetingname) => {this.setState({meetingName: meetingname, error: ''})}}
        />
        <TextInput
          style={{height: 50, width: width * .9}}
          placeholder="Description"
          value={this.state.description}
          onChangeText={(description) => {this.setState({description: description, error: ''})}}
        />
        <TextInput
          style={{height: 50, width: width * .9, marginBottom: 30}}
          placeholder="Location"
          value={this.state.location}
          onChangeText={(location) => {this.setState({location: location, error: ''})}}
        />
        <Text>Meeting Time</Text>
        <DatePicker
          style={{height: 50, width: width * .9}}
          date={this.state.date}
          mode="datetime"
          placeholder="select date"
          format="YYYY-MM-DD HH:MM"
          minDate={this.state.date}
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
          onDateChange={(date) => {this.setState({date: date, error: ''})}}
        />
        <Button
          style={{fontSize: 40}}
          title="Add Members"
          onPress={() => this.setState({showMembers: true})}
        />
        <Text> { this.state.error } </Text>
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