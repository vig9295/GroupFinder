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
import ActionButton from 'react-native-action-button';
import Tabs from 'react-native-tabs';

var width = Dimensions.get('window').width;

export default class NotificationScreen extends Component {

  static contextTypes = {
      notifications: React.PropTypes.number
  };

  constructor(props) {
    super(props);
    this.state = { username: '', page: 'reminders', reminders: [], joinRequests: []};
  }

  componentDidMount() {
    Cookie.get('hmm', 'username')
    .then((cookie) => {
      this.setState({ username: cookie});
      fetch('https://group-finder.herokuapp.com/' + cookie + '/receive_reminders', 
        {
          method: 'GET',
        }
      )
      .then((response) => response.json())
      .then((responseJson) => {
        if(responseJson['success']) {
          if(responseJson['data'].length > 0) {
            const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
            this.setState({
              reminders: ds.cloneWithRows(responseJson['data'])
            });
            console.log(this.state.reminders);
          }
        }
        else {
          this.setState({ error: responseJson['message'] });
        }
      })
      .catch((error) => {
        console.error(error);
      })
    });
  }

  render() {
    let reminders = null
    if (this.state.reminders.length == 0) {
      reminders = (
        <Text style={styles.instructions}>You have no reminders at this time!</Text>
      );
    } else {
      reminders = (
        <ListView 
        dataSource={this.state.reminders}
        renderRow={(rowData) =>
          <TouchableHighlight style={styles.classitem} onPress={() => this.onMeetingPress(rowData)}>
            <Text style={styles.classtext}>{rowData['title']}</Text>
          </TouchableHighlight>
        } />
      );
    }

    let joinRequests = null

    if (this.state.joinRequests.length == 0) {
      joinRequests = (
         <Text style={styles.instructions}>You have no join requests at this time!</Text>
      );
    } else {
      joinRequests = (
        <ListView style={styles.classlist}
          dataSource={this.state.classMembers}
          renderRow={(rowData) =>
            <TouchableHighlight style={styles.classitem} onPress={() => this.onMemberPress(rowData)}>
              <Text style={styles.classtext}>{rowData['name']}</Text>
            </TouchableHighlight>
          }
        />
      );
    }
    let component = reminders
    if (this.state.page == 'joinRequests') {
      component = joinRequests
    }

    return (
      <View style={styles.container}>
        <NavigationBar
          style={styles.navbar}
          title={'Notifications'}
          height={44}
          titleColor={'#fff'}
          backgroundColor={'#004D40'}
          leftButtonTitle={'Back'}
          leftButtonTitleColor={'#fff'}
          onLeftButtonPress={this.onLeftButtonPress.bind(this)}
        />
        <Tabs style={styles.tabs} selected={this.state.page} style={{backgroundColor:'white'}}
              selectedStyle={{color:'red'}} onSelect={el=>this.setState({page:el.props.name})}>
            <Text name="reminders">Reminders</Text>
            <Text name="joinRequests">Join Requests</Text>
        </Tabs>
        {component}
      </View>
    );
  }

  onLeftButtonPress() {
    this.props.navigator.pop();
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    flexDirection: 'column'
  },
  tabs : {
    flex: 1,
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
    flex: 1,
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
    flex: 1
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

AppRegistry.registerComponent('NotificationScreen', () => NotificationScreen);
