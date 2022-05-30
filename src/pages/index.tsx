import React, { useContext, useEffect, useState } from 'react';
import {
  StyleSheet,
  Button, TextInput, SafeAreaView
} from 'react-native';
import { AppContext } from '../components/context';

const Home = (props: any) => {

  //should be used to send and receive message in same channel
  const [channelName, setChannelName] = useState('')

  //set userName which should be unique
  const [userId, setUserId] = useState('')

  useEffect(() => {

    console.log("called")
    //context.client.logout()

  }, [])

  const onJoin = () => {


    props.navigation.navigate('Chats', { channel: channelName, userId: userId });


  }
  return (

    <SafeAreaView
      style={[styles.container]}
      removeClippedSubviews={false}>

      <TextInput
        style={styles.inputContainerStyle}
        placeholder="channel"
        value={channelName}
        onChangeText={(text: string) => setChannelName(text)}
        />

      <TextInput
        style={styles.inputContainerStyle}
        placeholder="userId"
        value={userId}
        onChangeText={(text: string) => setUserId(text)}
        />
      <Button
        title='join channel'
        onPress={() => onJoin()
        } 
        />

    </SafeAreaView>
  );

}

const styles = StyleSheet.create({
  colors: {
    backgroundColor: '#6200ee',
  },
  container: {
    backgroundColor: '#F5FCFF',
    flex: 1,
    flexDirection: 'column',
  },
  wrapper: {
    flex: 1,
  },
  inputContainerStyle: {
    margin: 8,
    flex: 2,
  },
  buttonContainerStyle: {
    flex: 2,
  },
  contenStyle: {
    textAlign: 'center',
  },
});

export default Home;