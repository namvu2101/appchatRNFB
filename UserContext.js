import {createContext, useState} from 'react';

const UserType = createContext();

const UserContext = ({children}) => {
  const [userFriends, setUserFriends] = useState([]);
  const [users, setUsers] = useState([]);
  const [userConversations, setUserConversations] = useState([]);
  return (
    <UserType.Provider
      value={{
        userFriends,
        setUserFriends,
        users,
        setUsers,
        setUserConversations,
        userConversations,
      }}>
      {children}
    </UserType.Provider>
  );
};

export {UserType, UserContext};
