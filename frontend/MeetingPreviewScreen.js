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
        />

        <View style={styles.meetingcontainer}>
          <Text style={styles.navmarginhelper}></Text>
          <View style={styles.sectioncontainer}>
            <Text style={styles.detailtext}>{this.props.classObj.name}</Text>
            <Text style={styles.detailtitle}>Class</Text>
          </View>
          <View style={styles.sectioncontainer}>
            <Text style={styles.detailtext}>{this.props.meetingObj.dateJson}</Text>
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
          <Text />
          <View style={styles.simplebutton}>
            <Button
              style={styles.simplebutton}
              title="Request To Join"
              onPress={this.requestToJoin.bind(this)}
            />
          </View>
        </View>

      </View>
    );
  }

  onLeftButtonPress() {
    this.props.navigator.pop();
  }

  requestToJoin() {
    //TODO
  }
}

const styles = StyleSheet.create({
  container: {
    //flex: 1,
    justifyContent: 'center',
    backgroundColor: '#F5FCFF',
    flexDirection: 'column',
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
