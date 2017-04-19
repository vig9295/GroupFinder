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
  ScrollView,
  View,
  Dimensions,
  Navigator,
  TouchableHighlight
} from 'react-native';

import Cookie from 'react-native-cookie';
import NavigationBar from 'react-native-navigation-bar';
import EStyleSheet from 'react-native-extended-stylesheet';
import { FilePickerManager } from 'NativeModules';
import RNFetchBlob from 'react-native-fetch-blob';
import ActionButton from 'react-native-action-button';
import RNCalendarEvents from 'react-native-calendar-events'


var width = Dimensions.get('window').width;

export default class MeetingScreen extends Component {


  constructor(props) {
    super(props);
    this.state = { error: '', chatID: '', data: [], calendarStatus:'', downloadStatus: '' };
    var formData = new FormData();
    formData.append('meetingID', this.props.meetingObj.meetingID);
    fetch('https://group-finder.herokuapp.com/' + this.props.meetingObj.meetingID + '/get_documents',
      {
        method: 'GET'
      }
    )
    .then((response) => response.json())
    .then((responseJson) => {
      if(responseJson['success']) {
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.setState({
          data: ds.cloneWithRows(responseJson['data'])
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

  render() {
    let listData = null;
    if (this.state.data.length == 0) {
      listData = (
        <TouchableHighlight>
          <Text>No notifications!</Text>
        </TouchableHighlight>
      )
    } else {
      listData = (
        <ListView
        dataSource={this.state.data}
        renderRow={(rowData) =>
          <TouchableHighlight onPress={() => this.onDownloadPress(rowData)}>
            <Text style={styles.detailtext}>{rowData['name']}</Text>
          </TouchableHighlight>
        } />
      )
    }

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
          rightButtonTitle={'Chat'}
          rightButtonTitleColor={'#fff'}
          onRightButtonPress={ this.onChatButtonPress.bind(this)}
        />
        <View style={styles.meetingcontainer}>
          <Text style={styles.navmarginhelper}></Text>
          <View style={styles.sectioncontainer}>
            <Text style={styles.detailtext}>{this.props.classObj.name}</Text>
            <Text style={styles.detailtitle}>Class</Text>
          </View>
          <View style={styles.sectioncontainer}>
            <Text style={styles.detailtext}>{this.props.meetingObj.dateJson.slice(0, 21)}</Text>
            <Text style={styles.detailtitle}>Date</Text>
          </View>
          <View style={styles.sectioncontainer}>
            <Text style={styles.detailtext}>{this.props.meetingObj.location}</Text>
            <Text style={styles.detailtitle}>Location</Text>
          </View>
          <View style={styles.sectioncontainer}>
            <Text style={styles.detailtext}>{this.props.meetingObj.description}</Text>
            <Text style={styles.detailtitle}>Description</Text>
          </View>
          <View style={styles.sectioncontainer}>
            { listData }
            <Text style={styles.detailtitle}>Documents</Text>
            <Text style={styles.instructions}> { this.state.downloadStatus } </Text>
          </View>
          <Text />
          <View style={styles.simplebuttoncontainer}>
            <Button
              style={styles.simplebutton}
              title="Upload Documents"
              onPress={this.onUploadPress.bind(this)}
            />
            <Button
              style={styles.simplebutton}
              title="Add to Calendar"
              color="#00695C"
              onPress={this.onCalendarPress.bind(this)}
            />
            <Text style={styles.instructions}> { this.state.calendarStatus } </Text>
          </View>
        </View>
      </View>
    );
  }

  onLeftButtonPress() {
    this.props.navigator.pop();
  }

  onChatButtonPress() {
    this.props.navigator.push({
      screen: 'ChatScreen',
      passProps: {
        username: this.props.username,
        chatID: this.props.meetingObj.chatID,
        title: this.props.title
      }
    });
  }


  onDownloadPress(documentData) {
    console.log(documentData);
    RNFetchBlob
    .config({
      path : documentData.path
    })
    .fetch('GET', 'https://content.dropboxapi.com/2/files/download', {
      Authorization : 'Bearer nulQVf3lvTcAAAAAAAACZkhOkppiIWpAX6t1vFMd2S31fjm9nnXalrogOljJwmol',
      'Dropbox-API-Arg': JSON.stringify({
        path : documentData.path,
      }),
    })
    .then((res) => {
      // the temp file path
      this.setState({downloadStatus: "Download Complete"});
    })
    .catch((errorMessage, statusCode) => {
      console.error(errorMessage);
      this.setState({downloadStatus: "Download Failed"});
    })
  }

  onCalendarPress() {
    console.log(this.props.meetingObj.dateJson);
    var startDate = new Date(this.props.meetingObj.dateJson);
    console.log(startDate.toISOString())
    Date.prototype.addHours= function(h){
      this.setHours(this.getHours()+h);
      return this;
    }
    var endDate = startDate.addHours(1);

    RNCalendarEvents.saveEvent(this.props.meetingObj.title, {
      location: this.props.meetingObj.location,
      notes: this.props.meetingObj.description,
      startDate: startDate.toISOString(),
      endDate: startDate.toISOString(),
    })
    .then(id => {
      this.setState({calendarStatus: 'Added to calendar!'})
    })
    .catch(error => {
      this.setState({calendarStatus: 'Could not add'})
    });
  }


  onUploadPress() {
    FilePickerManager.showFilePicker(null, (response) => {
      if (response.didCancel) {
        console.log('User cancelled file picker');
      }
      else if (response.error) {
        console.log('FilePickerManager Error: ', response.error);
      }
      else {
        RNFetchBlob.fetch('POST', 'https://content.dropboxapi.com/2/files/upload', {
          // dropbox upload headers
          Authorization : "Bearer nulQVf3lvTcAAAAAAAACZkhOkppiIWpAX6t1vFMd2S31fjm9nnXalrogOljJwmol",
          'Dropbox-API-Arg': JSON.stringify({
            path : response.path,
            mode : 'add',
            autorename : true,
            mute : false
          }),
          'Content-Type' : 'application/octet-stream',
        }, RNFetchBlob.wrap(response.path))
        .then((res) => {
          var responseData = res.json();
          var newformData = new FormData();
          newformData.append('meetingID', this.props.meetingObj.meetingID);
          newformData.append('name', responseData.name);
          newformData.append('path', responseData.path_lower);
          fetch('https://group-finder.herokuapp.com/upload_document',
            {
              method: 'POST',
              body: newformData
            }
          )
          .then((response) => response.json())
          .then((responseJson) => {
            if(responseJson['success']) {
              var formData = new FormData();
              formData.append('meetingID', this.props.meetingObj.meetingID);
              fetch('https://group-finder.herokuapp.com/' + this.props.meetingObj.meetingID + '/get_documents',
                {
                  method: 'GET'
                }
              )
              .then((response) => response.json())
              .then((responseJson) => {
                if(responseJson['success']) {
                  const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
                  this.setState({
                    data: ds.cloneWithRows(responseJson['data'])
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
            else {

            }
          })
          .catch((error) => {
            console.error(error);
          });
        })

        .catch((err) => {
          // error handling ..
        })
      }
    });
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    backgroundColor: '#F5FCFF',
    flexDirection: 'column',
  },
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
  },
  sectioncontainer: {
    paddingLeft: 24,
    paddingRight: 24,
    paddingBottom: 16,
    paddingTop: 8,
  },
  simplebutton: {
    paddingTop: 20,
    marginRight: 75,
    marginLeft: 75
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
  	marginBottom: 55
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
  detailtitle: {
    marginBottom: 5,
    fontSize: 15
  },
  detailtext: {
    color: '#333333',
    fontSize: 22
  }
});

AppRegistry.registerComponent('MeetingListScreen', () => MeetingListScreen);
