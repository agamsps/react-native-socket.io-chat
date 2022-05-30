import React, { useCallback, useEffect, useState } from 'react';
import { Actions, GiftedChat } from 'react-native-gifted-chat';
import { usePubNub } from 'pubnub-react';
import {Button, Image, PermissionsAndroid, Platform, Text, View } from 'react-native';
import { requestMultiple, RESULTS } from 'react-native-permissions';
import DocumentPicker, {
  isInProgress, types,
} from 'react-native-document-picker'

const ChatRoom = (props: any) => {


  const [messages, setMessages] = useState<any>([])
  const [channelName, setChannelName] = useState("")
  const [userId, setUserId] = useState("")
  const [start, setStart] = useState<any>(Date.now() * 1000000)
  const [isLoading, setIsLoading] = useState(true)

  const pubnub = usePubNub()

  useEffect(() => {

    let channel = props.route.params.channel
    let userId = props.route.params.userId


  
    requestCameraPermission()
    pubnub.setUUID(props.route.params.userId)

    pubnub.addListener(listener);
    pubnub.subscribe(
      {
        channels: [channel],
        withPresence: true
      }
    )

    pubnub.channelGroups.addChannels({
      channels: [channel],
      channelGroup: "sp1"
    }).then((response) => {


    }).catch((error) => {
      // handle error
    });



    setChannelName(channel)
    setUserId(userId)

    return () => {
      pubnub.unsubscribeAll()
      pubnub.removeListener(listener)

    }
  },[pubnub, channelName, userId])

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



  const listener = {
    status: (statusEvent: any) => {


      if (statusEvent.category === "PNConnectedCategory") {

        chatHistory();

      }
    },
    message: (envelope: any) => {
      if (envelope.channel === channelName && envelope.publisher != userId) {

        const newMessage: any = {
          _id: new Date().getTime() + Math.floor(Math.random() * 10000) + 1,
          text: envelope.message.content.toString(),
          createdAt: new Date(),
          user: {
            _id: new Date(),
            name: envelope.publisher.toString(),
            avatar: 'https://placeimg.com/140/140/any',
          },
        }
        setMessages((previousMessages: any) => GiftedChat.append(previousMessages, [newMessage]))
      }
    },
    file: (envelope: { message: { id: any; content: any; }; publisher: any; timetoken: any; }) => {

      const newMessage: any = {
        _id: new Date().getTime() + Math.floor(Math.random() * 10000) + 1,
        text: envelope.message.content.toString(),
        createdAt: new Date(),
        user: {
          _id: new Date(),
          name: envelope.publisher.toString(),
          avatar: 'https://placeimg.com/140/140/any',
        },
      }
      setMessages((previousMessages: any) => GiftedChat.append(previousMessages, [newMessage]))
    },

    presence: (presenceEvent: any) => {
           // This is where you handle presence. Not important for now :)
    }
  }

  const chatHistory = async () => {


      setIsLoading(false)

      let channelHistory: any = [];
      pubnub.fetchMessages(
        {
          channels: [channelName],
          count: 15,
          includeMessageType: true,
          start: start,
          includeMeta: true,
          includeUUID: true
        },
        async (status, response) => {
          if (response) {
            
            console.log(response.channels[channelName])
            setStart(response.channels[channelName][0].timetoken!!)

            for (var i = 0; i <= response.channels[channelName].length - 1; i++) {

              if (response.channels[channelName][i].message.file) {
                
                const fileUrl = await pubnub.getFileUrl({
                  channel: channelName,
                  id: response.channels[channelName][i].message.file.id,
                  name: response.channels[channelName][i].message.file.name
                })

                if(response.channels[channelName][i].meta?.type == 1) {
                  const newMessage: any = {
                    _id: parseInt(response.channels[channelName][i].timetoken!!.toString()) + Math.floor(Math.random() * 10000) + 1,
                   fileType : 1,
                    url: fileUrl,
                    createdAt: new Date(parseInt(response.channels[channelName][i].timetoken!!.toString()) / 10000),
                    user: {
                      _id: response.channels[channelName][i].uuid,
                      name: response.channels[channelName][i].uuid,
                      avatar: 'https://placeimg.com/140/140/any',
                    },
  
                  }
                  channelHistory.push(newMessage)
                }
                else {
                const newMessage: any = {
                  _id: parseInt(response.channels[channelName][i].timetoken!!.toString()) + Math.floor(Math.random() * 10000) + 1,
                  image: fileUrl,
                  createdAt: new Date(parseInt(response.channels[channelName][i].timetoken!!.toString()) / 10000),
                  user: {
                    _id: response.channels[channelName][i].uuid,
                    name: response.channels[channelName][i].uuid,
                    avatar: 'https://placeimg.com/140/140/any',
                  },

                }
                channelHistory.push(newMessage)
              }
              }

              else {

                const newMessage: any = {
                  _id: parseInt(response.channels[channelName][i].timetoken!!.toString()) + Math.floor(Math.random() * 10000) + 1,
                  text: response.channels[channelName][i].message.content,
                  createdAt: new Date(parseInt(response.channels[channelName][i].timetoken!!.toString()) / 10000),
                  user: {
                    _id: response.channels[channelName][i].message.id,
                    name: response.channels[channelName][i].message.id,
                    avatar: 'https://placeimg.com/140/140/any',
                  },
                }
                channelHistory.push(newMessage)
              }



            }
            channelHistory.reverse()
            setMessages((previousMessages: any) => GiftedChat.append(channelHistory, previousMessages))
            setIsLoading(true)
            
          }

        }
      );
    
  }

  const onSend = useCallback((messages: any[] = []) => {

    let messageChannel = props.route.params.channel
    let messageUserId = props.route.params.userId
    messages.forEach((message: any) => {

      const messageSend = {
        content: `${message.text}`,
        id: messageUserId
      };

      pubnub.publish({
        channel: messageChannel,
        message: messageSend,
        storeInHistory: true
      })
        .then(() => {

          setMessages((previousMessages: any) => GiftedChat.append(previousMessages, message))

        })
        .catch((exception: any) => {
          console.log('fail ===', exception.status);
        });



    });
  }, [])

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


  const setResult = (picker: any) => {
    console.log(picker)

    pubnub.sendFile({
      channel: channelName,
      storeInHistory: true,
    
      file: {
        name: picker.name,
        uri: picker.fileCopyUri,
        mimeType: picker.type,
      },
      meta : {
        type : 1
      }
    })
  }

  const renderMessageText = (props : any) => {

    if(props.currentMessage.fileType == 1) {
      return <Text > Pdf</Text>
    }
    
  };

  const isCloseToTop = ({ layoutMeasurement, contentOffset, contentSize }: any) => {
    const paddingToTop = 50;
    return contentSize.height - layoutMeasurement.height - paddingToTop <= contentOffset.y;
  }

  return (

    <View style={{ flex: 1 }}>

      <GiftedChat

        messages={messages}
        onSend={(messages: any[]) => { onSend(messages) }}
        user={{
          _id: userId,
        }}
        renderCustomView = {renderMessageText}
        renderActions={() => (
          <Actions
            {...props}
            containerStyle={{
              width: 44,
              height: 44,
              alignItems: 'center',
              justifyContent: 'center',
              marginLeft: 4,
              marginRight: 4,
              marginBottom: 0,
            }}
            icon={() => (
              <Image
                style={{ width: 32, height: 32 }}
                source={{
                  uri: 'https://placeimg.com/32/32/any',
                }}
              />
            )}
            options={{
              'Choose From Files': async () => {
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
              },
              Cancel: () => {
                console.log('Cancel');
              },
            }}
            optionTintColor="#222B45"
          />
        )}
        listViewProps={{
          scrollEventThrottle: 400,
          onScroll: ({ nativeEvent }: any) => { if (isCloseToTop(nativeEvent) && isLoading) chatHistory(); }
        }}
      />
      <Button
        title="open picker for single file selection"
        onPress={async () => {
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
        }}
      />
    </View>
  );
}

export default ChatRoom;