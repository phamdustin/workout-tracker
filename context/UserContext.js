import React, { createContext, useState, useEffect, useContext} from 'react'
import { supabase } from '@/utils/supabase'

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem("site") || "")

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
      setToken(data.data.token)
      localStorage.setItem("site", data.data.token)
      return
    }
    
  }

  const logoutAction = () => {
    setUser(null)
    setToken("")
    localStorage.removeItem("site")
  }


  useEffect(() => {
    async function fetchUser() {
      console.log('hi')
      const { data: { currentUser }, error} = await supabase.auth.getUser()
      if (currentUser) {
        const { data, error } = await supabase
          .from('testing_table')
          .select('*')
        if (!error) setUser(data) 
      }
    }
    fetchUser()
  }, [])

  return ( 
    <UserContext.Provider value={{ user, setUser, token, setToken, loginAction, logoutAction }}>
      {children}
    </UserContext.Provider>
  )
}


export const useAuth = () => {
  return useContext(UserContext)
}