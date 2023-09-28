import {createContext, useState} from 'react';

const UserType = createContext();

const UserContext = ({children}) => {
  const [userFriends, setUserFriends] = useState([]);

  return (
    <UserType.Provider value={{userFriends, setUserFriends}}>
      {children}
    </UserType.Provider>
  );
};

export {UserType, UserContext};
