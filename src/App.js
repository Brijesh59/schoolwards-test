
import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Alert, AsyncStorage, StatusBar, SafeAreaView} from 'react-native';
import firebase from 'react-native-firebase';
import Router from './Router';
import FirebaseConfig from '../utils/Firebase'


class App extends Component{

  constructor(props){
    super(props)
    this.firebase = new FirebaseConfig()
  }
  componentDidMount = async() => {
    this.firebase.checkPermission();
    this.firebase.createNotificationListeners();
  }

  // componentWillUnmount() {
  //   this.firebase.notificationListener;
  //   this.firebase.notificationOpenedListener;
  // }

  render(){

    return (
      <> 
        <StatusBar backgroundColor="white" barStyle="dark-content"  />
        <Router />
      </>
    )
  }
}  

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    marginTop:150
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

export default App;


