import React from 'react';
import { AuthProvider, UserProvider } from '../auth';
import { WebSocketProvider } from '../websocket';

function AppProvider({ children }: any) {
    return (
        <AuthProvider>
            <UserProvider>
                <WebSocketProvider>
                    {children}
                </WebSocketProvider>
            </UserProvider>
        </AuthProvider>
    )
}

export default AppProvider