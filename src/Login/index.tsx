import React, { useContext, useEffect, useState } from 'react';
import {
  StyleSheet,
  Button, TextInput, SafeAreaView
} from 'react-native'
import { chatClient } from '../client';

const Login = (props: any) => {

  //should be used to send and receive message in same channel
  const [userName, setUserName] = useState('')

  //set userName which should be unique
  const [userId, setUserId] = useState('')

 
  useEffect(() => {


  }, [])

  const onJoin = async () => {


   chatClient.connectUser(
        {
            id: userId,
            name: userName,
            image: 'https://getstream.io/random_svg/?name=John',
        },
        chatClient.devToken(userId),
    ).then( (response: any) => {

       
        console.log(response)

        props.navigation.navigate('DashboardStack', { userId: userId, userName: userName });

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
        placeholder="userId"
        value={userId}
        onChangeText={(text: string) => setUserId(text)}
        />

      <TextInput
        style={styles.inputContainerStyle}
        placeholder="username"
        value={userName}
        onChangeText={(text: string) => setUserName(text)}
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

export default Login;