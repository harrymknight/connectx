import React from 'react';
import { useAuth } from './auth-context';

interface IUserContext {
    data: {
        id: string
        username: string
    }
    fetched: boolean
}

const UserContext = React.createContext<IUserContext>({} as IUserContext);

const UserProvider = (props: any) => (
    <UserContext.Provider value={useAuth()?.user} {...props} />
)

const useUser = () => React.useContext(UserContext);

export { UserProvider, useUser };