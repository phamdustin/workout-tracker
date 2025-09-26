/* tester accounts in .env
  testing123@gmail.com 1234
  tyrion@gmail.com monkey1
 */

  import { View, StyleSheet} from 'react-native'
  import { useState } from 'react'
  import { SafeAreaView } from 'react-native-safe-area-context'
  import Form from 'react-bootstrap/Form'
  import Button from 'react-bootstrap/Button'
  
  import { useAuth } from '@/context/UserContext'
  
  export default function Login() {
  
    const {user, setUser} = useAuth()
    const {token, setToken} = useAuth()
  
  /*   async function signIn(email: string, password: string) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
  
      if (error) {
        console.error('Login error:', error.message)
        return { success: false, error: error.message}
      }
  
      console.log('User logged in:', data.user)
      setLoggedIn(!loggedIn)
      return { success: true, user: data.user}
    } */
  
    function LoginForm() {
      const [email, setEmail] = useState("")
      const [password, setPassword] = useState("")
  
      const auth = useAuth()
      const onPressFunction = async () =>{
        // Pass the email and password values along to the supabase
        console.log("Login processing!")
        const result = await auth.loginAction(email, password)
        setEmail("")
        setPassword("")
      }
  
      const emailChange = (event: any) => {
        setEmail(event.target.value)
      }
      const passwordChange = (event: any) => {
        setPassword(event.target.value)
      }
  
  
      return(
        
        <SafeAreaView>
          <View>
            <Form>
              <Form.Group className= "mb-3">
                <Form.Label className="form-label">Email address</Form.Label>
                <Form.Control className="form-control" onChange={emailChange} style={styles.inputTextContainer} value={email} placeholder="email@gmail.com"/>
                <Form.Text className="text-muted">We'll never share your email with anyone else.</Form.Text>
              </Form.Group>
              <Form.Group className= "mb-3">
                <Form.Label className="form-label">Password</Form.Label>
                <Form.Control className="form-control" onChange={passwordChange} style={styles.inputTextContainer} value={password} placeholder="password"/>
              </Form.Group>
              <div>
                <Button variant="primary" type="button" onClick={onPressFunction}>
                  Submit
                </Button>
              </div>
            </Form>
  
          </View>
        </SafeAreaView>
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
      margin: 1,
    },
    button: {
      display: 'flex', 
      justifyContent: 'flex-end',
      fontSize: 15,
      marginRight: 20,
    }
  })