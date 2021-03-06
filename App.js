
import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Alert, AsyncStorage, StatusBar, SafeAreaView} from 'react-native';
import firebase from 'react-native-firebase';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});


class App extends Component{

  async componentDidMount(){
    this.checkPermission();
    this.createNotificationListeners(); //add this line
  }

  componentWillUnmount() {
    this.notificationListener;
    this.notificationOpenedListener;
  }

  //1
  async checkPermission() {
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
      this.getToken();
    } else {
      console.log('User not permitted for token.');
      this.requestPermission();
    }
  }

  //2
  async requestPermission() {
    try {
      console.log('Requesting Permission...');
      await firebase.messaging().requestPermission();
      // User has authorised
      this.getToken();
    } catch (error) {
      // User has rejected permissions
      console.log('Permission Rejected!!');
    }
  }

  //3
  async getToken() {
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    if (!fcmToken) {
      fcmToken = await firebase.messaging().getToken();
      if (fcmToken) {
        // user has a device token
        console.log('fcmToken: ', fcmToken);
        await AsyncStorage.setItem('fcmToken', fcmToken);
      }
    }
    console.log('fcmToken:', fcmToken);
  }

  async createNotificationListeners() {
    /*
    * Triggered when a particular notification has been received in foreground
    * */
    this.notificationListener = 
    firebase.notifications().onNotification((notification) => {
      console.log('Notification Recieved: ', notification);
      const { _title: title, _body: body } = notification;
      console.log('onNotification Foreground: ');
      
      const localNotification = new firebase.notifications.Notification({
        show_in_foreground: true,
      })
      .setNotificationId(notification._notificationId)
      .setTitle(notification._title)
      .setBody(notification._body)
      .android.setChannelId('fcm_FirebaseNotifiction_default_channel') // e.g. the id you chose above
      // .android.setSmallIcon('@drawable/ic_launcher') // create this icon in Android Studio
      // .android.setColor('#000000') // you can set a color here
      // .setSound("default")
      .android.setVibrate(500)
      .android.setPriority(firebase.notifications.Android.Priority.High);

      firebase.notifications()
        .displayNotification(localNotification)
        .catch(err => console.error(err));

     console.log("Stage 2")   
    });

    const channel = new firebase.notifications.Android.Channel('fcm_FirebaseNotifiction_default_channel', 'Demo app name', firebase.notifications.Android.Importance.High)
      .setDescription('Demo app description')
      // .setSound('sampleaudio.wav');
    firebase.notifications().android.createChannel(channel);

    console.log("Stage 3")

    /*
    * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
    * */
    this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
      const { _title: title, _body: body } = notificationOpen.notification;
      console.log('onNotificationOpened:');
      // Alert.alert(title, body)
    });

    /*
    * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
    * */
    const notificationOpen = await firebase.notifications().getInitialNotification();
    if (notificationOpen) {
      const { _title: title, _body: body } = notificationOpen.notification;
      console.log('getInitialNotification:');
      // Alert.alert(title, body)
    }
    /*
    * Triggered for data only payload in foreground
    * */
    this.messageListener = firebase.messaging().onMessage((message) => {
      //process data message
      console.log("JSON.stringify:", JSON.stringify(message));
    });
  }

  render(){

    return (
      <> 
        <StatusBar backgroundColor="white" barStyle="dark-content"  />
        <SafeAreaView >
          <View style={styles.container}>
            <Text style={styles.welcome}>Welcome to React Native!</Text>
            <Text style={styles.instructions}>To get started, edit App.js</Text>
            <Text style={styles.instructions}>{instructions}</Text>
          </View>
        </SafeAreaView>
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
