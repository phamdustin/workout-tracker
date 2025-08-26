import React, { createContext, useState, useEffect, useContext} from 'react'
import { supabase } from '@/utils/supabase'

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem("site") || "")
  const [userInfo, setUserInfo] = useState(null)

  const loginAction = async (email, password) => {
    // possibly use const { data, error } 
    const data = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (data.error) {
      console.error('Login error:', data.error.message)
      return { success: false, error: data.error.message }
    }
    else {
      console.log('User logged in:', data.data.user)
      setUser(data.data.user)
      setToken(data.data.session?.access_token ?? "")
      localStorage.setItem("site", data.data.session?.access_token ?? "")

      console.log("user's ID is ",data.data.user.id)
      const { data: userData, error } = await supabase
        .from("testing_table")
        .select('*')
        .eq('user_id', data.data.user.id)
      if (error) {
        console.error("ERROR pulling userData", error)
      } else {

        setUserInfo(userData[0] ?? null)

        console.log("Successfully pulled userInfo from supabase ",userInfo)

      }
      return
    }
    
  }

  const logoutAction = () => {
    setUser(null)
    setToken("")
    localStorage.removeItem("site")
  }

  const fetchUser = async () => {
    console.log('hi')
    const { data, error} = await supabase.auth.getUser()
    const currentUser = data?.user
    if (currentUser) {
      const { userData, error } = await supabase
        .from('testing_table')
        .select('*')
      if (!error) {
        setUser(userData) 
      } else {
        console.error("error was: ", error)
      }

    } 
  }

  useEffect(() => {
    fetchUser()
  }, [])

  return ( 
    <UserContext.Provider value={{ user, setUser, token, setToken, userInfo, loginAction, logoutAction }}>
      {children}
    </UserContext.Provider>
  )
}


export const useAuth = () => {
  return useContext(UserContext)
}