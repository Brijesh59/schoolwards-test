import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { AsyncStorage } from 'react-native';

class SplashScreen extends Component {
    componentDidMount(){
        setTimeout(async () => {
            const isUserLoggedIn = await AsyncStorage.getItem('isUserLoggedIn')
            // if(isUserLoggedIn === null){
            //     console.log('NULL')
            // }
            // if(isUserLoggedIn === 'true'){
            //     console.log('TRUE')
            // }
            // if(isUserLoggedIn === 'false'){
            //     console.log('FALSE')
            // }
            isUserLoggedIn === 'true' ?  Actions.drawerMenu() : Actions.auth()
        }, 2000)
    }
    render() {
        return (
            <View style={styles.container}>
               <Text style={styles.welcome}>SplashScreen</Text>    
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

export default SplashScreen;