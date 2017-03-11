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
import { GiftedChat } from 'react-native-gifted-chat';
import Pusher from 'pusher-js/react-native';



var width = Dimensions.get('window').width;

export default class ChatScreen extends Component {

  constructor(props) {
    super(props);
    this.state = { error: '', messages: [] };
    console.log(this.props.username);
    this.refresh()
    this.pusher = new Pusher('0aab40d486c9e2ce1c43', {
      encrypted: true
    });
    this.chatRoom = this.pusher.subscribe(this.props.chatID);
  }

  componentDidMount() {
    var dude = this;
    this.chatRoom.bind('new_message', function(data) {
      if(data['success']) {
        dude.refresh();
      }
    });
  }

  refresh() {
    url = 'https://group-finder.herokuapp.com/' + this.props.chatID + '/get_messages'; 
    fetch(url, 
      {
        method: 'GET',
      }
    )
    .then((response) => response.json())
    .then((responseJson) => {
      if(responseJson['success']) {
        if(responseJson['data'].length > 0) {
          console.log(responseJson['data']);
          this.setState({messages:responseJson['data']});
        } else {
          this.setState({
            messages: [
              {
                _id: 1,
                text: 'Hello! Send your first message here',
                createdAt: new Date(Date.UTC(2016, 7, 30, 17, 20, 0)),
                user: {
                  _id: 2,
                  name: 'GroupFinder',
                  avatar: '',
                },
              },
            ],
          });
        }
      }
      else {
        this.setState({ error: responseJson['message'] });
      }
    })
    .catch((error) => {
      console.error(error);
    })
  }

  onSend(data) {
    console.log(data[0])
    var formData = new FormData();
    formData.append('senderID', this.props.username);
    formData.append('content', data[0].text);
    formData.append('time', JSON.stringify(data[0].createdAt));
    url = 'http://128.61.61.119:5000/' + this.props.chatID + '/create_message';
    fetch(url, 
      {
        method: 'POST',
        body: formData
      }
    )
    .then((response) => response.json())
    .then((responseJson) => {
      if(responseJson['success']) {
        this.refresh();
      }
    })
    .catch((error) => {
      console.error(error);
    });
  }

  render() { 
    return ( 
      <GiftedChat
        messages={this.state.messages}
        onSend={this.onSend.bind(this)}
        user={{
          _id: this.props.username,
        }}
      />
    );
  }

  onLeftButtonPress() {
    this.props.navigator.pop();
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

AppRegistry.registerComponent('ChatScreen', () => ChatScreen);