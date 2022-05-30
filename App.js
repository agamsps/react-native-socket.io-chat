
import React, { useCallback, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NavigationContainer } from '@react-navigation/native'
import ChatRoom from './src/chatroom';
import Login from './src/Login';
import Home from './src/pages';
import ParticularMessage from './src/MessageList';
import {
  Chat,
  OverlayProvider
} from 'stream-chat-react-native';

import { AppContext } from './src/context/AppContext';
import { chatClient } from './src/client';

const Stack = createNativeStackNavigator()

const App = () => {

  const [channel, setChannel] = useState({
    channel: {}
  });

  const DashboardStack = () => {

    return (
      <AppContext.Provider
        value={{ channel: channel, setChannel }}>
        <OverlayProvider>
          <Chat client={chatClient}>
            <Stack.Navigator
              screenOptions={{
                headerShown: false
              }}>

              <Stack.Screen name='Chats' component={ChatRoom} />
              <Stack.Screen name='Message' component={ParticularMessage} />

            </Stack.Navigator>
          </Chat>
        </OverlayProvider>
      </AppContext.Provider>
    )
  }

  return (

    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false
        }}>
        <Stack.Screen name='Login' component={Login} />
        <Stack.Screen name="DashboardStack" component={DashboardStack} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default App