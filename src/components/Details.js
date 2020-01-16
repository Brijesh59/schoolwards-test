import React, { Component } from 'react';
import { View, Text, BackHandler } from 'react-native';
import { Actions } from 'react-native-router-flux';
class Details extends Component {
    componentDidMount(){
        // Go to dashboard, when hardwareBackPressed btn pressed
        BackHandler.addEventListener('hardwareBackPressed', () => {
            Actions.dashboard()
        })
    }
    render() {
        return (
            <View>
                <Text>Details</Text>
             </View>
        );
    }
}

export default Details;