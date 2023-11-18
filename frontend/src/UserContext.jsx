import { createContext, useEffect, useState } from "react";
import axios from "axios";

const UserContext = createContext({});

const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    if (!user) {
      axios.get('/profile')
      .then(({ data }) => {
        setUser(data);
      });
    }
  }, []);
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserContextProvider };
