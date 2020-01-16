import React, { Component } from 'react';
import {View, Text, StyleSheet, TextInput, Button, BackHandler, AsyncStorage} from 'react-native'
import ActivityLoader from './ActivityLoader'
import { Actions } from 'react-native-router-flux';

class Dashboard extends Component {
    componentDidMount(){
        BackHandler.addEventListener('hardwareBackPressed', () => {
            // BackHandler.exitApp()
            // return true;
            Actions.drawerClose()
            return true
        })
    }

    render() {
        return (
            <View 
                style={styles.container}  
                onStartShouldSetResponder={() => console.log('You click by View')}
              >
                <Button 
                    style={{ marginTop:'20px'}}
                    title="Go to Details Page" 
                    onPress={()=>Actions.details()} 
                />
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
      padding:20,
      margin: 10
    }
});

export default Dashboard;