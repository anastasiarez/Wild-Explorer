import { createContext, useEffect, useState } from "react";
import axios from "axios";

const UserContext = createContext({});

const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);


  useEffect(() => {
    
    if (!user) {
      axios.get('/user/profile')
        .then(({ data }) => {
          setUser(data);
          setReady(true);
        }).catch((e)=> {
          console.log("error", e);
        })
    }
  }, []);
  return (
    <UserContext.Provider value={{ user, setUser, ready }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserContextProvider };
