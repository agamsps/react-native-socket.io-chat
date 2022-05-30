import React, { useCallback, useContext, useEffect, useState } from 'react';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ChannelList, ChannelPreviewMessenger, Chat, OverlayProvider } from 'stream-chat-react-native';
import { chatClient } from '../client';
import { AppContext } from '../context/AppContext';
import { useSafeAreaInsets} from 'react-native-safe-area-context';

const ChatRoom = (props: any) => 
{
  const [channelName, setChannelName] = useState("")
  const [userId, setUserId] = useState("")
  const {bottom} = useSafeAreaInsets();
  const {channel,setChannel} = useContext(AppContext);

  const additionalFlatListProps = {
    keyboardDismissMode: 'on-drag' as const,
    getItemLayout: (_: any, index: number) => ({
      index,
      length: 65,
      offset: 65 * index,
    }),};

  const options = {
    presence: true,
    state: true,
    watch: true,};

    const filters = {
      members: {$in: [chatClient?.user?.id]},
      type: 'messaging',
    };

  useEffect(() => 
  {
    return () => {}
  }, [channelName, userId])

  const onSelect = useCallback(
    ( channel: any) => {
      setChannel(channel)
    
      props.navigation.navigate('Message', { channel: channel});
    },
    [props.navigation, setChannel],
  );


  return (
    <View style={{ flex: 1 }}>
    <GestureHandlerRootView  style={{ flex: 1 }}>
  
      <View style={{ flex: 1 }}>
        <ChannelList
        additionalFlatListProps={additionalFlatListProps}
        filters={filters}
        onSelect={onSelect}
        HeaderNetworkDownIndicator={() => null}
        options= {options}
        Preview={ChannelPreviewMessenger} />
      </View>
    
    </GestureHandlerRootView>
    </View>
  );
}

export default ChatRoom;