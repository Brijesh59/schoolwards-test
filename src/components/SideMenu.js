import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import { Button } from 'react-native';
import { Actions } from 'react-native-router-flux';

export default class SideMenu extends Component {
    constructor(props) {
        super(props);
    };

    render() {
        return (
            <View style={styles.container}
            onStartShouldSetResponder={() => console.log('You touched sidemenu')}>
                <Text>Menu</Text>
                <View style={styles.closeBtn}>
                    <Button title="Close" onPress={()=>Actions.drawerClose()} />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        backgroundColor: '#F5FCFF',
        paddingRight: 20,
        paddingLeft: 20,
        paddingBottom: 10,
        paddingTop: 50,
    },
    closeBtn:{
        marginTop: 20
    }

});