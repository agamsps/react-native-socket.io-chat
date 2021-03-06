import React, { useContext, useEffect, useState } from 'react';
import {
  StyleSheet,
  Button, TextInput, SafeAreaView
} from 'react-native';
import { chatClient } from '../client';

const Home = (props: any) => {

  //should be used to send and receive message in same channel
  const [userName, setUserName] = useState('')

  //set userName which should be unique
  const [userId, setUserId] = useState('')

  const [channelName, setChannelName] = useState('')


  useEffect(() => {

    let username = props.route.params.userName
    let userId = props.route.params.userId

    setUserName(username)
    setUserId(userId)


  }, [userId, userName])

  const onJoin = async () => {

    const channel = chatClient.channel('messaging', channelName, {
      name: 'Awesome channel about traveling',
    });

    channel.create()
    .then( response => {

      console.log(response)

      props.navigation.navigate('Chats', { channel: channelName, userId: userId, userName : userName });
  }

  ).catch(ex => {
      console.log(ex)
  }) ;

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