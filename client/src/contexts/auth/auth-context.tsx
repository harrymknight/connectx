import { AxiosResponse } from 'axios';
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { Refresh } from '../../routes/login/components/refresh';
import { API } from '../../utils';
import './auth-context.css';

export interface Credentials {
    username: string,
    password: string
}

interface IAuthContext {
    user: any,
    login: (credentials: Credentials) => Promise<AxiosResponse<any>>
    register: (credentials: Credentials) => Promise<AxiosResponse<any>>
    logout: () => Promise<AxiosResponse<any>>
}

const AuthContext = React.createContext<IAuthContext>({} as IAuthContext);

const DEF_DELAY = 1000;

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms || DEF_DELAY));
}

const fetchProfile = async () => {
    await sleep(1000);
    return API.get('profile');
}

function AuthProvider(props: any) {
    const [user, setUser] = useState<any>(undefined);
    const { isLoading, isError, isSuccess, data, refetch } = useQuery('profile', fetchProfile, { enabled: false });

    React.useEffect(() => {
        if (user !== null && (data?.data.id !== user?.data.id)) {
            refetch();
        }
    }, [user, data, refetch]);

    const login = React.useCallback(async (credentials: Credentials) => {
        try {
            const response = await API.post('auth/login', credentials);
            setUser({data: response.data, fetched: false});
        } catch (e) {
            throw new Error('Invalid username or password');
        }
    }, [setUser]);

    const register = React.useCallback(async (credentials: Credentials) => {
        try {
            await API.post('auth/register', credentials);
        } catch (e) {
            throw new Error('Username is taken');
        }
    }, []);

    const logout = React.useCallback(async () => {
        try {
            await API.post('auth/logout');
            setUser(null);
        } catch (e) {
            throw new Error('Logout failed');
        }
    }, [setUser]);

    const value = React.useMemo(() => ({ user, login, logout, register }), [
        user,
        login,
        logout,
        register
    ])

    if (isLoading) {
        return (
            <div className='fetch-auth'>
                <div className='rotating' >
                    <Refresh />
                </div>
            </div>
        )
    }

    if (isError) {
        return <div> <Refresh /> </div>
    }

    if (isSuccess) {
        if (user !== null && !user?.fetched) {
            setUser({data: data?.data, fetched: true});
        }
    }

    return <AuthContext.Provider value={value} {...props} />
}

const useAuth = () => {
    const context = React.useContext(AuthContext)
    if (context === undefined) {
        throw new Error(`useAuth must be used within a AuthProvider`)
    }
    return context;
}

export { AuthProvider, useAuth };