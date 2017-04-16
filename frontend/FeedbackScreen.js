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
    this.state = {
      error: '', feedback: ''
    }
  }

  render() {
    let listData = null;

    return (
      <View style={styles.container}>
        <NavigationBar
          style={styles.navbar}
          title={'Feedback'}
          height={44}
          titleColor={'#fff'}
          backgroundColor={'#004D40'}
          leftButtonTitle={'Back'}
          leftButtonTitleColor={'#fff'}
          onLeftButtonPress={this.onLeftButtonPress.bind(this)}
        />

        <TextInput
          style={{height: 200, width: width * .9, marginBottom: 50}}
          placeholder="Write us a note"
          onChangeText={(text) => this.setState({ feedback: text, error: '' })}
        />
        <Button
          style={{fontSize: 40}}
          title="Submit Feedback"
          color="#00695C"
          onPress={this.feedback.bind(this)}
        />
        <Text> { this.state.error } </Text>
      </View>
    );
  }

  onLeftButtonPress() {
    this.props.navigator.pop();
  }

  feedback() {
    var formData = new FormData();
    formData.append('feedback', this.state.feedback);
    fetch('https://group-finder.herokuapp.com/feedback', 
        {
          method: 'POST',
          body: formData
        }
      )
    .then((response) => response.json())
    .then((responseJson) => {
      this.setState({error: 'Feedback successful'})
    })
    .catch((error) => {
      console.error(error);
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
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    marginTop: 30,
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('MeetingListScreen', () => MeetingListScreen);
