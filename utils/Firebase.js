import firebase from 'react-native-firebase';
// import {firebase as firebaseMessaging} from '@react-native-firebase/messaging';
import { AsyncStorage } from 'react-native';
import app_config from './config'

export default class FirebaseConfig{

  async checkPermission() {
    console.log('Checking for Permission ...');
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
      this.getToken();
    } else {
      console.log('User not permitted for token.');
      this.requestPermission();
    }
  }

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

  async getToken() {
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    if (!fcmToken) {
      fcmToken = await firebase.messaging().getToken();
      if (fcmToken) {
        // user has a device token
        await AsyncStorage.setItem('fcmToken', fcmToken);
      }
    }
    console.log('fcmToken: ', fcmToken);
    return fcmToken;
  }

  async createNotificationListeners() {

    console.log("Listening for Notification... ")
        
    /*
        Android 8.0 (API Level 26), notifications must specify a Notification Channel or they will not appear.
    */
    const channel = 
    new firebase.notifications.Android.Channel(
      'fcm_FirebaseNotifiction_default_channel', 
      app_config.schoolName, 
      firebase.notifications.Android.Importance.High)
    .setDescription('app description')
    .setSound('default')
    .enableLights(true)
    .enableVibration(true)

    firebase.notifications().android.createChannel(channel)

    // CASE 1: Triggered when a particular notification has been received in foreground
    this.notificationListener = 
        firebase.notifications().onNotification(async(notification) => {
            console.log('Notification Recieved in Foreground: ', notification);
            
            if(notification._title === 'logout'){
                console.log('Logging out ...')
                await AsyncStorage.setItem('isUserLoggedIn', 'false')
            }


            const localNotification = new firebase.notifications.Notification({
                show_in_foreground: true,
            })
                .setNotificationId(notification._notificationId)
                .setTitle(notification._title)
                .setBody(notification._body)
                .android.setChannelId('fcm_FirebaseNotifiction_default_channel') 
                // .android.setSmallIcon('@drawable/ic_launcher') //icon in Android Studio
                // .android.setColor('#000000') 
                .setSound("default")
                .android.setVibrate(500)
                .android.setPriority(firebase.notifications.Android.Priority.High);

            firebase.notifications()
                .displayNotification(localNotification)
                .catch(err => console.error(err)) 
        });


    // CASE 2: If app is in background, listen when a notification is clicked/opened:
    this.notificationOpenedListener = 
        firebase.notifications().onNotificationOpened((notificationOpen) => {
            console.log('Notification Opened when app in Background: ', notificationOpen)
        })

    // CASE 3: If app is closed, check if it was opened by a notification being clicked/opened 
    const notificationOpen = await firebase.notifications().getInitialNotification()
    if (notificationOpen) {
      console.log('Notification Opened when app was closed: ', notificationOpen)
    }

    // CASE 4: Triggered for data only payload in foreground
    this.messageListener = firebase.messaging().onMessage((message) => {
      console.log("JSON.stringify: ", JSON.stringify(message))
    });


    //  const unsubscribe = firebaseMessaging.messaging().onMessage(async (remoteMessage) => {
    //     console.log('FCM Message Data:', remoteMessage.data);
    //   });
     
     

  }

}  

