import React, { useContext, useEffect } from 'react';
import { SafeAreaView, StyleSheet, View, PermissionsAndroid, Platform } from 'react-native';
import { Channel, FileIcon, MessageList, useMessageInputContext } from 'stream-chat-react-native';
import InputMessageText from '../components/InputMessage';
import { AppContext } from '../context/AppContext';
import { requestMultiple, RESULTS } from 'react-native-permissions';
import DocumentPicker, {
  isInProgress, types,
} from 'react-native-document-picker'
import { chatClient } from '../client';

const ParticularMessage = (props: any) => {

  const { channel } = useContext(AppContext);
  const { sendMessage, toggleAttachmentPicker, uploadNewFile } = useMessageInputContext();

  useEffect(() => {

    requestCameraPermission()

  }, [channel])


  const onSendFile = async () => {


    try {
      const pickerResult = await DocumentPicker.pickSingle({
        presentationStyle: 'fullScreen',
        copyTo: 'cachesDirectory',
        type: [types.doc, types.docx, types.pdf, types.images, types.video, types.xls,
        types.xlsx, types.plainText]
      })
      setResult(pickerResult)
    } catch (e) {
      handleError(e)
    }
  }

  const handleError = (err: unknown) => {
    if (DocumentPicker.isCancel(err)) {
      console.warn('cancelled')
      // User cancelled the picker, exit any dialogs or menus and move on
    } else if (isInProgress(err)) {
      console.warn('multiple pickers were opened, only the last will be considered')
    } else {
      throw err
    }
  }

  const onSendMessage = async (message: String) => {
    const response = await channel.sendMessage({
      text: message
    })
  }

  const requestCameraPermission = async () => {

    const permissions = [PermissionsAndroid.PERMISSIONS.CAMERA,
    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE]
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.requestMultiple(
          permissions
        );
        // If CAMERA Permission is granted
        const isPermissionGranted = await checkMultiplePermissions(permissions);
        return isPermissionGranted
      } catch (err) {
        console.warn(err);
        return false;
      }
    } else return true;
  };

  const checkMultiplePermissions = async (permissions: any) => {
    let isPermissionGranted = false;
    const statuses = await requestMultiple(permissions);
    for (var index in permissions) {
      if (statuses[permissions[index]] === RESULTS.GRANTED) {
        isPermissionGranted = true;
      } else {
        isPermissionGranted = false;
        break;
      }
    }
    return isPermissionGranted;
  }

  const setResult = async (picker: any) => {

    const response = await chatClient?.sendFile(`${channel._channelURL()}/file`,
      picker.fileCopyUri,
      picker.name,
      picker.type
    )

    let type = ""
    if (picker.type.includes("image")) {
      type = "image"
    }
    else if (picker.type.includes("video")) {
      type = "video"
    }
    else if (picker.type.includes("application")) {
      type = "file"
    }
    const message = await channel.sendMessage({
      attachments: [
        {
          type: type,
          mime_type: picker.type,
          thumb_url: response.file,
          asset_url: response.file,
          title: picker.name

        }
      ],
    }, { skip_push: true });

  }

  const onMessagePress = (message: any) => {
    if (message.message.attachments.length > 0) {
      console.log(message.message.attachments[0].asset_url)
    }
  }

  return (

    <SafeAreaView
      style={
        styles.container}>
      <View style={{ flex: 1 }}>
        {channel && <Channel
          channel={channel}
          
          onLongPressMessage={() => null}
          onPressMessage={onMessagePress}
          MessageReplies={() => null}
          allowThreadMessagesInChannel={false}
          messageActions={undefined}>
          <MessageList />

          {/* <MessageInput /> */}
        </Channel>
        }
      </View>

      <InputMessageText
        onSendButtonPress={onSendMessage}
        onSendAttachmentPress={onSendFile} />

    </SafeAreaView>

  );
}

export default ParticularMessage

const styles = StyleSheet.create({

  container: {
    backgroundColor: '#ffffff',
    flex: 1,
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
