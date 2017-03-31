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
import ActionButton from 'react-native-action-button';


var width = Dimensions.get('window').width;

export default class ClassListScreen extends Component {

  static contextTypes = {
      notifications: React.PropTypes.number
  };

  constructor(props) {
    super(props);
    this.state = { error: '', data: [], username: '' };
    Cookie.get('hmm', 'username')
    .then((cookie) => {
      var formData = new FormData();
      formData.append('memberID', cookie);
      this.setState({ username: cookie});
      fetch('https://group-finder.herokuapp.com/find_classes', 
        {
          method: 'POST',
          body: formData
        }
      )
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
      })
    });
  }  

  render() { 
    let listData = null
    if (this.state.data.length == 0) {
      listData = (
        <TouchableHighlight onPress={this.goGatechLogin.bind(this)}>
          <Text style={styles.instructions}>You have no classes. Please login to you GT account to sync your classes.</Text>
        </TouchableHighlight>
      );
    } else {
      listData = (
        <ListView style={styles.classlist}
        dataSource={this.state.data}
        renderRow={(rowData) => 
          <TouchableHighlight style={styles.classitem} onPress={() => this.onClassPress(rowData)}>
            <Text style={styles.classtext}>{rowData['name']}</Text>
          </TouchableHighlight>
        } />
      );
    }
    notificationText = "Alert (" + this.context.notifications + ")"; 
    return (  
      <View style={styles.container}>
        <NavigationBar 
          style={styles.navbar}
          title={'Class List'}
          height={44}
          titleColor={'#fff'}
          backgroundColor={'#004D40'}
          leftButtonTitle={'Log Out'}
          leftButtonTitleColor={'#fff'}
          rightButtonTitle={notificationText}
          rightButtonTitleColor={'#fff'}
          onRightButtonPress={ this.onNotificationPress.bind(this)}
        />
        { listData } 
      </View>
    );
  }

  onNotificationPress() {
    this.props.navigator.push({ screen: 'NotificationScreen' });
  }

  goGatechLogin() {
    this.props.navigator.push({ screen: 'GatechLoginScreen' });
  }

  onClassPress(classObj) {
    this.props.navigator.push({ 
      screen: 'MeetingListScreen',
      passProps: {
        username: this.state.username,
        classObj: classObj
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
  },
  classlist: {
    marginTop: 44
  },
  classitem: {
    height: 75,
    width: width,
    borderBottomWidth: 3,
    borderColor: '#E0F2F1',
    justifyContent: 'center',
    alignItems: 'center',
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

AppRegistry.registerComponent('ClassListScreen', () => ClassListScreen);