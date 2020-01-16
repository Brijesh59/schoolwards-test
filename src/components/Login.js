import React, { Component } from 'react';
import { View, Text, TextInput, Button, BackHandler, StyleSheet } from 'react-native';
import ActivityLoader from './ActivityLoader'
import APIs from '../../utils/api'
import { Actions } from 'react-native-router-flux';

class Login extends Component {

    constructor(props) {
        super(props);
        this.state = { 
          value: '',
          isLoading: false,
          data: '',
        }
    }
    componentDidMount(){

        // Prevent going Back
        BackHandler.addEventListener('hardwareBackPressed', () => {
            //BackHandler.exitApp()
            return true;
        })
    }

    onChangeText = (text) => {
        this.setState({
          value: text
          ,data: ''
        })  
    }

    sendOTP = () => {
      if(!this.state.value){
        this.setState({ data: {response: "invalid_mobile"}, value: ''})
        return
      }
      this.setState({isLoading: true, data: ''})
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
        if(data.response === 'success'){
            Actions.OTP(this.state.value);
        }
      })
      .catch(err => console.log(err))
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.welcome}>Login</Text>
                <TextInput
                    style={{ height: 40, borderColor: 'gray', borderWidth: 1, width:'80%', textAlign:'center' }}
                    onChangeText={text => this.onChangeText(text)}
                    value={this.state.value}
                    numeric value
                    keyboardType={'numeric'} 
                    placeholder="Please Enter your 10 digit Mobile No"
                />
                <View style={{ width:'80%'}}> 
                    <Button 
                        style={{ marginTop:'20px'}}
                        title="Send OTP" 
                        onPress={this.sendOTP} 
                        disabled={this.state.isLoading}
                    />
                </View>
                {this.state.isLoading && <ActivityLoader />}
                <Text>
                  {this.state.data.response}
                </Text>
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

export default Login;