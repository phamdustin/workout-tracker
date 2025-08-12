import React, { createContext, useState, useEffect } from 'react'
import { supabase } from '@/utils/supabase'

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null)

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
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  )
}