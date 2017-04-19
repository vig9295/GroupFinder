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

import { TabViewAnimated, TabBar } from 'react-native-tab-view';
import Cookie from 'react-native-cookie';
import NavigationBar from 'react-native-navigation-bar';
import EStyleSheet from 'react-native-extended-stylesheet';
import ActionButton from 'react-native-action-button';

var width = Dimensions.get('window').width;

export default class NotificationScreen extends Component {

  static contextTypes = {
      notifications: React.PropTypes.number
  };

  constructor(props) {
    super(props);
    this.state = { username: '', reminders: [], joinRequests: [], index: 0, routes: [
      { key: '1', title: 'Reminders' },
      { key: '2', title: 'Join Requests' },
    ]};
  }

  handleChangeTab(index) {
    this.setState({ index });
  }

  componentDidMount() {
    Cookie.get('hmm', 'username')
    .then((cookie) => {
      this.setState({ username: cookie});
      fetch('https://group-finder.herokuapp.com/' + cookie + '/get_notifications',
        {
          method: 'GET',
        }
      )
      .then((response) => response.json())
      .then((responseJson) => {
        if(responseJson['success']) {
          if(responseJson['reminders'].length > 0) {
            const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
            this.setState({
              reminders: ds.cloneWithRows(responseJson['reminders'])
            });
          }
          if(responseJson['requests'].length > 0) {
            const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
            this.setState({
              joinRequests: ds.cloneWithRows(responseJson['requests'])
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
    });
  }

  render() {
    return (
      <TabViewAnimated
        style={styles.tabViewContainer}
        navigationState={this.state}
        renderScene={this.renderScene.bind(this)}
        renderHeader={this.renderHeader.bind(this)}
        onRequestChangeTab={this.handleChangeTab.bind(this)}
      />
    );
  }

  renderHeader(props) {
      return (
        <View>
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
          <TabBar {...props} style={styles.tabBar}/>
        </View>
      )
  }

  acknowledgeReminder(row) {
    var formData = new FormData();
    formData.append('memberID', this.state.username);
    formData.append('meetingID', row.meetingID);
    url = 'https://group-finder.herokuapp.com/acknowledge_reminder';
    fetch(url, {
      method: 'POST',
      body: formData
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if(responseJson['success']) {
        fetch('https://group-finder.herokuapp.com/' + this.state.username + '/get_notifications',
          {
            method: 'GET',
          }
        )
        .then((response) => response.json())
        .then((responseJson) => {
          if(responseJson['success']) {
            if(responseJson['reminders'].length > 0) {
              const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
              this.setState({
                reminders: ds.cloneWithRows(responseJson['reminders'])
              });
            }
          }
        })
        .catch((error) => {
          console.error(error);
        });
      }
    })
    .catch((error) => {
      console.error(error);
    });
  }

  acknowledgeRequest(row, urlString) {
    var formData = new FormData();
    formData.append('memberID', row.memberID);
    formData.append('meetingID', row.meetingID);
    url = 'https://group-finder.herokuapp.com/' + urlString + '_meeting_request';
    fetch(url, {
      method: 'POST',
      body: formData
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if(responseJson['success']) {
        fetch('https://group-finder.herokuapp.com/' + this.state.username + '/get_notifications',
          {
            method: 'GET',
          }
        )
        .then((response) => response.json())
        .then((responseJson) => {
          if(responseJson['success']) {
            console.log(responseJson['requests']);
            if(responseJson['requests'].length > 0) {
              const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
              this.setState({
                joinRequests: ds.cloneWithRows(responseJson['requests'])
              });
            } else {
              this.setState({joinRequests: []});
            }
          }
        })
        .catch((error) => {
          console.error(error);
        });
      }
    })
    .catch((error) => {
      console.error(error);
    });
  }

  declineRequest(row) {
    this.acknowledgeRequest(row, 'ignore');
  }

  acceptRequest(row) {
    this.acknowledgeRequest(row, 'accept');
  }

  renderScene({ route }) {
    let reminders = null
    if (this.state.reminders.length == 0) {
      reminders = (
        <Text style={styles.instructions}>You have no reminders at this time!</Text>
      );
    } else {
      reminders = (
        <ListView
        dataSource={this.state.reminders}
        renderRow={(rowData) => {
          text = 'You have been reminded about ' + rowData['title'];
          return (
            <View>
              <TouchableHighlight style={styles.classitem} >
                <Text style={styles.classtext}>{text}</Text>
              </TouchableHighlight>
              <Button
                style={{fontSize: 40}}
                title="Mark As Read"
                color="#009B8F"
                onPress={() => this.acknowledgeReminder(rowData)}/>
            </View>
          );
        }} />
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
          dataSource={this.state.joinRequests}
          renderRow={(rowData) => {
            text = rowData['memberName'] + ' requests to join ' + rowData['meetingTitle']
            return (
              <View>
              <TouchableHighlight style={styles.classitem}>
                <Text style={styles.classtext}>{text}</Text>
              </TouchableHighlight>
                <View style={{flexDirection:'row'}}>
                  <Button
                    style={{fontSize: 40}}
                    title="Accept"
                    color="#009B8F"
                    onPress={() => this.acceptRequest(rowData)}/>
                  <Button
                    style={{fontSize: 40}}
                    title="Decline"
                    color="#FFA07A"
                    onPress={() => this.declineRequest(rowData)}/>
                </View>
              </View>
            );
          }}
        />
      );
    }

    switch (route.key) {
      case '1':
        return (
          <View style={styles.container}>
            <Text style={styles.titletext}>Reminders</Text>
            { reminders }
          </View>
        );
        break;
      case '2':
        return (
          <View style={styles.container}>
            <Text style={styles.titletext}>Join Requests</Text>
            { joinRequests }
          </View>
        );
        break;
      default:
        return null;
      }
  }

  onNotificationPress() {
    this.props.navigator.push({ screen: 'NotificationScreen' });
  }

  onLeftButtonPress() {
    this.props.navigator.pop();
  }

  onMeetingPress(meetingObj) {
    this.props.navigator.push({
      screen: 'MeetingScreen',
      passProps: {
        username: this.props.username,
        meetingObj: meetingObj,
        classObj: this.props.classObj      }
    });
  }

  onMeetingNotPartOfPress(meetingObj) {
    this.props.navigator.push({
      screen: 'MeetingPreviewScreen',
      passProps: {
        username: this.props.username,
        meetingObj: meetingObj,
        classObj: this.props.classObj      }
    });
  }

  onMemberPress(memberObj) {
    var formData = new FormData();
    formData.append('memberID', this.props.username);
    formData.append('member1ID', memberObj.memberID);
    url = 'https://group-finder.herokuapp.com/get_chatID2';
    fetch(url, {
      method: 'POST',
      body: formData
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if(responseJson['success']) {
        this.props.navigator.push({
          screen: 'ChatScreen',
          passProps: {
            title: memberObj.name,
            username: this.props.username,
            chatID: responseJson['chatID']
          }
        });
      }
      else {
        this.setState({ error: responseJson['message'] });
      }
    })
    .catch((error) => {
      console.error(error);
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    flexDirection: 'column'
  },
  tabBar: {
    marginTop: 44,
    backgroundColor: '#009980'
  },
  tabViewContainer: {
    flex: 1
  },
  page: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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

AppRegistry.registerComponent('NotificationScreen', () => NotificationScreen);
