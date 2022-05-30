import React, { useState } from "react"
import { GestureResponderEvent, Image, StyleSheet, TextInput, View, TouchableOpacity } from "react-native"
import { ICONS } from "../../../Constants"

interface Props {
    onSendButtonPress: (arg : String) => void,
    onSendAttachmentPress?: (event: GestureResponderEvent) => void
};

const InputMessageText = ({ onSendAttachmentPress, onSendButtonPress }: Props) => {

    const [messageText, setMessageText] = useState("")

    const sendMessage = () => {

        onSendButtonPress(messageText)
        setMessageText("")
    }
    return (
        <View style={styles.container}>
            <TextInput
                style={{ marginLeft: 10 }}
                value={messageText}
                placeholder="Type your message here"
                onChangeText={setMessageText} />


            <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity onPress={onSendAttachmentPress}>
                    <Image
                        source={ICONS.attachmentIcon}
                        style={styles.iconStyle}
                        resizeMode='contain' />

                </TouchableOpacity>
                <TouchableOpacity onPress={sendMessage}>
                    <View style={styles.messageButtonStyle}>
                        <Image
                            source={ICONS.sendIcon}
                            style={styles.sendIconStyle}
                            resizeMode='contain' />

                    </View>
                </TouchableOpacity>
            </View>

        </View >
    )
}

export default InputMessageText

const styles = StyleSheet.create({

    container: {
        backgroundColor: "#f2f2f2",
        height: 50,
        flexDirection: 'row',
        margin: 20,
        borderRadius: 40,
        borderTopRightRadius: 0,
        justifyContent: 'space-between'
    },

    iconStyle: {
        width: 20,
        marginRight: 15,
        marginLeft: 10
    },

    sendIconStyle: {
        width: 20,
        marginRight: 15,
        marginLeft: 10,
        alignItems: 'center',
        alignSelf: 'center'
    },
    messageButtonStyle: {
        backgroundColor: "#F69220",
        width: 50,
        height: 50,
        borderTopLeftRadius: 40,
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
        justifyContent: 'center',
    },
});