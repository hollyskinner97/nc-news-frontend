import { createContext, useState } from "react";

export const UserAccount = createContext(null);

export const UserAccountProvider = ({ children }) => {
  const [username, setUsername] = useState("jessjelly");
  const [userId, setUserId] = useState(0);
  return (
    <UserAccount.Provider value={{ username, setUsername, userId, setUserId }}>
      {children}
    </UserAccount.Provider>
  );
};
