
import React from 'react'
import DeviceInfo from 'react-native-device-info'
import ActivityLoader from './components/ActivityLoader'
import Alert from './components/custom/Alert'
import APIs from './utils/api'
import PushNotification from 'react-native-push-notification'
import firebase from 'react-native-firebase'

import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  StatusBar,
  TextInput,
  Button,
  FlatList,
  AsyncStorage,
  ListView,
  ListViewBase
} from 'react-native';

class App extends React.Component{
  constructor(props) {
    super(props);
    this.state = { 
      id: '', 
      value: '',
      isLoading: false,
      data: null,
      notification: '',
      NOTICES: []
    }
  }
   
   componentDidMount = async () =>{
    let notices = await AsyncStorage.getItem('NOTICES') 
    this.setState({
      id: DeviceInfo.getUniqueID(),
      NOTICES: notices != null ? JSON.parse(notices)['NOTICES'] : []
    }, 
    ()=>{
      console.log("State is: ", this.state)
    })  
    // console.log(DeviceInfo.getVersion())      // app_version
    // console.log(DeviceInfo.getSystemName())  //devicetype
    // console.log(DeviceInfo.getDeviceName()) 
    PushNotification.configure({
      onRegister: function(token) {
        console.log("TOKEN:", token);
      },
      //Called when a remote or local notification is opened or received
      onNotification: function(notification) {
        console.log("NOTIFICATION:", notification);
        //PushNotification.localNotification(notification);
        this.setState({
          notification: notification
        })

        /* Create Notification Channel for Android > 8.0 to show notification in foreground */
        this.createNotificationChannel(notification);

        /*
          Store the notification data.
        */
        this.saveData({
          title: notification.notification.title,
          body: notification.notification.body
        }, 'NOTICES')

      }.bind(this),
      permissions: {
        alert: true,
        badge: true,
        sound: true
      },
      popInitialNotification: true,
      requestPermissions: true
    });
  }

  createNotificationChannel(notification){
    const newNotification = new firebase.notifications.Notification()
      .android.setChannelId('12009')
      .setNotificationId(notification.id)
      .setTitle(notification.notification.title)
      .setBody(notification.notification.body)
      .setSound("default")
      .android.setAutoCancel(true)
      .android.setCategory(firebase.notifications.Android.Category.Alarm)

    // Build a channel
    const channelId = new firebase.notifications.Android.Channel(
      '12009', 
      'channelName', 
      firebase.notifications.Android.Importance.Max);

    // Create the channel
    firebase.notifications().android.createChannel(channelId);
    firebase.notifications().displayNotification(newNotification)
  }

  saveData = async (data, type) => {
    
    let allNotifications = await AsyncStorage.getItem(type)
    if(allNotifications != null){
      console.log('Inside If...', allNotifications)
      let newData =  Object.assign({}, JSON.parse(allNotifications))
      newData[type] = [data, ...newData[type]]
      try{
        await AsyncStorage.setItem(type, JSON.stringify(newData))
        let d = await AsyncStorage.getItem(type)
        this.setState({[type]: JSON.parse(d)[type]})
        console.log("Data Saved Success: ", this.state.NOTICES)
      }
      catch(error){
        console.log('error', error)
      } 
    }
    else{
      console.log('Inside else...')
      let newData =  Object.assign({}, allNotifications)
      console.log('new data: ', newData)
      newData[type] = [data]
      try{
        await AsyncStorage.setItem(type, JSON.stringify(newData))
        let d = await AsyncStorage.getItem(type)
        this.setState({ [type]: JSON.parse(d)[type]})
        console.log("Data Saved Success: ",  this.state.NOTICES)
      }
      catch(error){
        console.log('error', error.message)
      }
    }
  }

  getData = async (type) => {
    try{
      let data = await AsyncStorage.getItem(type)
      if(data != null)
        return JSON.parse(data);
      return {}
    }
    catch(error){
      console.log("Error in GET:", error)
      return {};
    }
  }

  onChangeText = (text) => {
    this.setState({
      value: text
      ,data: null
    })  
  }

  sendOTP = () => {
    console.log(this.state)
    if(!this.state.value){
      this.setState({ data: {response: "invalid_mobile"}, value: ''})
      return
    }
    this.setState({isLoading: true, data: null})
    console.log("Send OTP")
    let formData = new FormData();
    formData.append('mobile', this.state.value)
    formData.append('appname', 'svs')

    fetch(APIs.GET_OTP, {
      method: 'POST',
      body: formData
    })
    .then(res => res.json())
    .then(data => {
      this.setState({isLoading: false, data})
      console.log(data)
      // Alert({
      //   title: data.response,
      //   message:  data.otp, 
      //   textOk: "Login",
      //   textCancel:  "Cancel"
      // })
      
    })
  .catch(err => console.log(err))
        
  }
  render(){
    console.log("Re-rendering ....")
    return (
      <> 
        <StatusBar backgroundColor="white" barStyle="dark-content"  />
        <SafeAreaView >
          <View style={styles.container}>
             <Text
              style={{ marginTop:'20%' }}>
                Please Enter your Mobile No</Text>
             <TextInput
                style={{ height: 40, borderColor: 'gray', borderWidth: 1, width:'80%', textAlign:'center' }}
                onChangeText={text => this.onChangeText(text)}
                value={this.state.value}
                numeric value
                keyboardType={'numeric'} 
              />
              <View style={{ width:'80%'}}> 
              <Button 
                style={{ marginTop:'20px'}}
                title="Send OTP" 
                onPress={this.sendOTP} 
                disabled={this.state.isLoading}
              />
              {this.state.data && 
                <>
                <Text
                  style={{ marginTop:'20%' }}>  
                  {this.state.data.response} 
                </Text>
                {this.state.data.response === "success" && 
                  <>
                   <Text
                      style={{ marginTop:'5%' }}>  
                      Mobile No: {this.state.data.mobile}
                    </Text>
                    <Text
                      style={{ marginTop:'5%' }}>  
                      OTP: {this.state.data.otp}
                    </Text>
                  </>
                }
                </>
              }
                {this.state.isLoading && <ActivityLoader />}
              </View > 
             
              <FlatList
                  data={this.state.NOTICES}
                  keyExtractor={(x, i) => i}
                  renderItem={({item}) => <Text style={styles.item}>{item.body}</Text>}
                />
             <Button title="Clear" onPress={()=>{AsyncStorage.clear()}}></Button>
           </View>
        </SafeAreaView>
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
});

export default App;
