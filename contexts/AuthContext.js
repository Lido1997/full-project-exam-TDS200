import { createContext, useContext } from 'react';

const AuthContext = createContext();

export const Authprovider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Set session of user
  const setAuth = authUser => {
    setUser(authUser);
  }


  const setUserData = userData => {
    setUser({...userData});
  }

  return (
    <AuthContext.Provider value={{ user, setAuth, setUserData }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext);