import React, {Component} from 'react'
import {Alert} from 'react-native'

export default function(props){
    const { title, message, textOk, textCancel } = props
    return (
        Alert.alert(
            title,
            message,
            [
                {
                text: textCancel && 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
                },
                {text: textOk && 'Ok', onPress: () => console.log('OK Pressed')},
            ],
            {cancelable: false},
        )
    )
}




