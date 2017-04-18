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

export default class MeetingListScreen extends Component {

  static contextTypes = {
      notifications: React.PropTypes.number
  };

  constructor(props, context) {
    super(props, context);
    this.state = { error: '',
      meetingsPartOf: [],
      meetingsNotPartOf: [],
      reported: [],
      classMembers: [],
      index: 0,
      routes: [
        { key: '1', title: 'Meetings' },
        { key: '2', title: 'People' },
      ]
    };
  }

  handleChangeTab(index) {
    this.setState({ index });
  }

  fetchCallback() {
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
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.setState({
          meetingsPartOf: ds.cloneWithRows(responseJson['data1']),
          meetingsNotPartOf: ds.cloneWithRows(responseJson['data2'])
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
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.setState({
          meetingsPartOf: ds.cloneWithRows(responseJson['data1']),
          meetingsNotPartOf: ds.cloneWithRows(responseJson['data2'])
        });
      }
      else {
        this.setState({ error: responseJson['message'] });
      }
    })
    .catch((error) => {
      console.error(error);
    });
    url = 'https://group-finder.herokuapp.com/class/' + this.props.classObj.classID + '/members';
    fetch(url)
      .then((response) => response.json())
      .then((responseJson) => {
        if(responseJson['success']) {
          if(responseJson['data'].length > 0) {
            var data = responseJson['data'];
            classMembers = []
            for (var i = 0; i < data.length; i++) {
              if(data[i].memberID != this.props.username) {
                classMembers.push(data[i]);
              }
            }
            const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
            this.setState({ classMembers : ds.cloneWithRows(classMembers) });
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
      notificationText = "Alert (" + this.context.notifications + ")";
      return (
        <View>
          <NavigationBar
            style={styles.navbar}
            title={'Meeting List'}
            height={44}
            titleColor={'#fff'}
            backgroundColor={'#004D40'}
            leftButtonTitle={'Back'}
            leftButtonTitleColor={'#fff'}
            onLeftButtonPress={this.onLeftButtonPress.bind(this)}
            rightButtonTitle={notificationText}
            rightButtonTitleColor={'#fff'}
            onRightButtonPress={ this.onNotificationPress.bind(this)}
          />
          <TabBar {...props} style={styles.tabBar}/>
        </View>
      )
  }

  report(user) {
    var formData = new FormData();
    formData.append('reporterID', this.props.username);
    formData.append('reportedID', user.memberID);
    formData.append('reason', "Default reason");
    url = 'https://group-finder.herokuapp.com/send_report'
    fetch(url,
      {
        method: 'POST',
        body: formData
      }
    )
    .then((response) => {
      reportList = this.state.reported;
      reportList.push(user.memberID);
      this.setState({reported: reportList});

      //NOTE: The below code is incredibly hacky but is present to force a re-render
      //For some reason the list view is not automatically updated with state update
      //to reportList. Please ignore below and avoid at all costs in the future.

      classMembers = this.state.classMembers;
      this.setState({ classMembers : [] });
      this.setState({ classMembers : classMembers });

    })
    .catch((error) => {
      console.error(error);
    });
  }

  renderScene({ route }) {
    if (this.state.meetingsNotPartOf.length == 0) {
      meetingsYouArePartOf = (
        <TouchableHighlight onPress={this.onAddGroup.bind(this)}>
          <Text style={styles.instructions}>You have no groups for this class. Press here to make one!</Text>
        </TouchableHighlight>
      );
    } else {
      meetingsYouArePartOf = (
        <ListView style={styles.classlist}
        dataSource={this.state.meetingsPartOf}
        renderRow={(rowData) =>
          <TouchableHighlight style={styles.classitem} onPress={() => this.onMeetingPress(rowData)}>
            <Text style={styles.classtext}>{rowData['title']}</Text>
          </TouchableHighlight>
        } />
      );
    }

    if (this.state.meetingsNotPartOf.length == 0) {
      meetingsNotPartOf = (
        <TouchableHighlight onPress={this.onAddGroup.bind(this)}>
          <Text style={styles.instructions}>You have no groups for this class. Press here to make one!</Text>
        </TouchableHighlight>
      );
    } else {
      meetingsNotPartOf = (
        <ListView style={styles.classlist}
        dataSource={this.state.meetingsNotPartOf}
        renderRow={(rowData) =>
          <TouchableHighlight style={styles.classitem} onPress={() => this.onMeetingNotPartOfPress(rowData)}>
            <Text style={styles.classtext}>{rowData['title']}</Text>
          </TouchableHighlight>
        } />
      );
    }

    if (this.state.classMembers.length == 0) {
      studentList = (
         <Text style={styles.instructions}>You have no students in this class</Text>
      );
    } else {
      studentList = (
        <ListView style={styles.classlist}
          dataSource={this.state.classMembers}
          renderRow={(rowData) =>
            <View>
              <TouchableHighlight style={styles.classitem} onPress={() => this.onMemberPress(rowData)}>
                <Text style={styles.classtext}>{rowData['name']}</Text>
              </TouchableHighlight>
              {this.state.reported.indexOf(rowData['memberID']) >= 0 && 
                <Text style={{textAlign:'center', fontSize:20 }}> {'User reported'} </Text>
              }
              {this.state.reported.indexOf(rowData['memberID']) < 0 && 
                <Button
                  style={{fontSize: 40}}
                  title="Report"
                  color="#009B8F"
                  onPress={() => this.report(rowData)}/>
              }
            </View>
          }
        />
      );
    }

    switch (route.key) {
      case '1':
        return (
          <View style={styles.container}>
            <Text style={styles.titletext}>Your Meetings</Text>
            { meetingsYouArePartOf }
            <Text style={styles.titletext}>Available Meetings</Text>
            { meetingsNotPartOf }
            <ActionButton
              buttonColor="rgba(231,76,60,1)"
              onPress={() => { this.onAddGroup()}}
            />
          </View>
        );
        break;
      case '2':
        return (
          <View style={styles.container}>
            <Text style={styles.titletext}>Class Members</Text>
            { studentList }
            <ActionButton
              buttonColor="rgba(231,76,60,1)"
              onPress={() => { this.onAddGroup()}}
            />
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
        classID: this.props.classObj.classID,
        callback: this.fetchCallback.bind(this)
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

AppRegistry.registerComponent('MeetingListScreen', () => MeetingListScreen);
