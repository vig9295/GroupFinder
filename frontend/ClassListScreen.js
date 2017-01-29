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

var width = Dimensions.get('window').width;

export default class ClassListScreen extends Component {

  constructor(props) {
    super(props);
    this.state = { error: '', data: [] };
  }

  componentDidMount() {
    Cookie.get('hmm', 'username')
    .then((cookie) => {
      var formData = new FormData();
      formData.append('memberID', cookie);
      fetch('http://128.61.62.145:5000/find_classes', 
        {
          method: 'POST',
          body: formData
        }
      )
      .then((response) => response.json())
      .then((responseJson) => {
        if(!responseJson['success']) {
          const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
          this.state = {
            data: ds.cloneWithRows(responseJson['data'])
          };
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
        <ListView
        dataSource={this.state.dataSource}
        renderRow={(rowData) => <Text>{rowData}</Text>} />
      );
    }
    return (
      <View style={styles.container}>
        { listData } 
      </View>
    );
  }

  goGatechLogin() {
    //this.props.navigator.push({ screen: 'GatechLogin' });
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