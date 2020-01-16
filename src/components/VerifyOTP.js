import React, { Component } from 'react';
import {View, Text, StyleSheet, TextInput, Button} from 'react-native'
import { Actions } from 'react-native-router-flux';
import { AsyncStorage } from 'react-native';
import DeviceInfo from 'react-native-device-info'

import ActivityLoader from './ActivityLoader'
import FirebaseConfig from '../../utils/Firebase'
import APIs from '../../utils/api'
import app_config from '../../utils/config'


class VerifyOTP extends Component {
    constructor(props){
        super(props)
        this.state = {
            OTP: '',
            isLoading: false,
            version: DeviceInfo.getVersion(),
            deviceType: DeviceInfo.getSystemName(),
            mobileNo: this.props.data,
            fcmToken: null,
            showErrorMessage: null
        }
    }

    componentDidMount = async() => {
        const fcmToken = await AsyncStorage.getItem('fcmToken')
        this.setState({fcmToken})
    }
    
    loginToDashboard = () => {
        this.setState({isLoading: true})
        // verify OTP, then redirect to dashboard.

        console.log(this.state)

        let formData = new FormData();
        formData.append('mobile', this.state.mobileNo)
        formData.append('deviceid', this.state.fcmToken)
        formData.append('devicetype', this.state.deviceType)
        formData.append('otp', this.state.OTP)
        formData.append('app_version', app_config.version)
        formData.append('appname', app_config.schoolName)

        console.log("FormData: ",formData)

        fetch(APIs.VERIFY_OTP, {
          method: 'POST',
          body: formData  
        })
        .then(res => res.json() )
        .then((data) => {
            this.setState({isLoading: false, data})
            if(data.response === 'success'){
              this.setState({isLoading: false})
              this.setUserLoggedIn()
              Actions.drawerMenu();
            }
            else{
              this.setState({
                  isLoading: false,
                  showErrorMessage: data.response
              })
            }
        })
        .catch(err => {
            this.setState({
                isLoading: false,
                showErrorMessage: err.toString()
            })
            console.log("Error: ", err)
        }) 
    } 

    setUserLoggedIn = async () => {
        await AsyncStorage.setItem('isUserLoggedIn', 'true')
    }

    onChangeText = (text) => {
        this.setState({
          OTP: text,
          showErrorMessage: null
        })  
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.welcome}>VerifyOTP</Text>
                <TextInput
                    style={{ height: 40, borderColor: 'gray', borderWidth: 1, width:'80%', textAlign:'center', marginTop:'2%' }}
                    onChangeText={text => this.onChangeText(text)}
                    value={this.state.value}
                    numeric value
                    keyboardType={'numeric'} 
                    placeholder="Enter 6 digit OTP"
                />
                <View style={{ width:'80%'}}> 
                    <Button 
                        style={{ marginTop:'20px'}}
                        title="Login" 
                        onPress={this.loginToDashboard} 
                        disabled={this.state.isLoading}
                    />
                </View>
                {this.state.isLoading && <ActivityLoader />}
                {this.state.showErrorMessage && <Text>{this.state.showErrorMessage}</Text>}
            </View>
        );
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
    }
});

export default VerifyOTP;