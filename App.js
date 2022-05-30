
 import React from 'react';
 import {createNativeStackNavigator} from '@react-navigation/native-stack'
 import {NavigationContainer} from '@react-navigation/native'
 import Home from './src/pages';
 import ChatRoom from './src/chatroom';
 import { PubNubProvider } from 'pubnub-react';

 import PubNub from "pubnub";
 
 const Stack = createNativeStackNavigator()
 
 const pubnub = new PubNub({
  subscribeKey: "sub-c-4ec38f6f-8094-40b1-ba15-201f7d66f977",
  publishKey: "pub-c-ec0f3f89-9123-4d77-8a21-97f1c8ab0d38",
  uuid: "0"
});
 
 
 const App = () => {
   return (

  <NavigationContainer>
    
    <PubNubProvider client={pubnub}>
     <Stack.Navigator
     screenOptions={{
       headerShown: false
     }}
     >
       <Stack.Screen name = 'HomeScreen' component={Home}/>
         <Stack.Screen name = 'Chats' component={ChatRoom}/>
     </Stack.Navigator>
     </PubNubProvider>
  </NavigationContainer>
 )
 }
 
export default App