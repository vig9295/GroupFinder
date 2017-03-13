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
import { FilePickerManager } from 'NativeModules';
import RNFetchBlob from 'react-native-fetch-blob';


var width = Dimensions.get('window').width;

export default class MeetingScreen extends Component {

  constructor(props) {
    super(props);
    this.state = { error: '', chatID: '', data: [] };
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
          <Text>Bruh</Text>
        </TouchableHighlight>
      )
    } else {
      listData = (
        <ListView
        dataSource={this.state.data}
        renderRow={(rowData) =>
          <TouchableHighlight onPress={() => this.onDownloadPress(rowData)}>
            <Text>{rowData['name']}</Text>
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
          onRightButtonPress={this.onRightButtonPress.bind(this)}
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

        { listData }

        <Button
          style={{fontSize: 40}}
          title="Upload Documents"
          onPress={this.onUploadPress.bind(this)}
        />

      </View>
    );
  }

  onLeftButtonPress() {
    this.props.navigator.pop();
  }

  onRightButtonPress() {
    this.props.navigator.push({
      screen: 'ChatScreen',
      passProps: {
        username: this.props.username,
        chatID: this.props.meetingObj.chatID,
      }
    });
  }


  onDownloadPress(documentData) {

    let dirs = RNFetchBlob.fs.dirs;
    console.log(dirs.DownloadDir);
    RNFetchBlob
    .config({
      // add this option that makes response data to be stored as a file,
      // this is much more performant.
      path : '/storage/emulated/0/DCIM/Camera/sprint3-demo.jpg'


    })
    .fetch('GET', 'https://content.dropboxapi.com/2/files/download', {
      Authorization : 'Bearer nulQVf3lvTcAAAAAAAACZkhOkppiIWpAX6t1vFMd2S31fjm9nnXalrogOljJwmol',
      'Dropbox-API-Arg': JSON.stringify({
        path : documentData.path,
        mode : 'add',
        autorename : true,
      }),
    })
    .then((res) => {
      // the temp file path
      console.log("Download complete")
    })
    .catch((errorMessage, statusCode) => {
      console.log(errorMessage);

      // error handling
    })

  }


  onUploadPress() {
    FilePickerManager.showFilePicker(null, (response) => {
      console.log('Response = ', response);

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
          console.log(responseData);
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
