/* tester accounts in .env
 */

import { supabase } from '@/utils/supabase'
import { View, Text, TextInput, StyleSheet, Button, Pressable } from 'react-native'
import { useState } from 'react'

export default function login() {

  async function signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      console.error('Login error:', error.message)
      return { success: false, error: error.message}
    }

    console.log('User logged in:', data.user)
    return { success: true, user: data.user}
  }

  function LoginForm() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    function onPressFunction () {
      console.log("pressed!")
    }
    return(
      <View>
        <TextInput style={styles.inputTextContainer} value={email} onChangeText={setEmail} placeholder="email@gmail.com"/>
        <TextInput style={styles.inputTextContainer} value={password} onChangeText={setPassword} placeholder="password"/>
        <Pressable onPress={onPressFunction} >
          <Text>Login</Text>
        </Pressable>
      </View>
    )
  }

  return (
    <View>
      <LoginForm></LoginForm>
    </View> 
  )
}

const styles = StyleSheet.create({
  inputTextContainer:{
    flex: 1,
    backgroundColor: 'white',
    fontSize: 20,
    textAlign: 'center',
    margin: 10,

  }
})

