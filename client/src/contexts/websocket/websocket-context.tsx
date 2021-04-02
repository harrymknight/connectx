import React, { useReducer, useState } from 'react';
import { useUser } from '../auth';

interface ISocketContext {
    socket: WebSocket | undefined,
    sendMessage: (event: string, data: any) => void
}

const WebSocketStateContext = React.createContext<ISocketContext>({} as ISocketContext);
const WebSocketDispatchContext = React.createContext<React.Dispatch<any>>({} as React.Dispatch<any>);

function listenerReducer(state: any, action: any) {
    switch (action.type) {
        case 'add': {
            const newState = { ...state };
            newState[action.event] = action.callback;
            return newState;
        }
        case 'remove': {
            const newState = { ...state };
            delete newState[action.event];
            return newState;
        }
    }
}

function WebSocketProvider({ children }: any) {
    const [socket, setSocket] = useState<WebSocket | undefined>(undefined);
    const [listeners, dispatch] = useReducer(listenerReducer, {});
    const user = useUser();

    const sendMessage = React.useCallback((event: string, data: any) => {
        const payload = { event, data }
        if (socket) {
            socket.send(JSON.stringify(payload));
        }
    }, [socket]);

    React.useEffect(() => {
        if (user?.fetched) {

            if (!socket) {
                const newSocket = new WebSocket(`ws://localhost/api/?userId=${user.data.id}`);
                
                newSocket.onopen = (() => {
                    setSocket(newSocket);
                })

            }
            
            if (socket) {
                socket.onmessage = (e => {
                    const message = JSON.parse(e.data);
                    if (message.event === 'move') {
                        console.log(message);
                    }
                    if (Object.keys(listeners).includes(message.event)) {
                        const callback = listeners[message.event];
                        callback(message.data);
                    }
                })
            }
            
        };
    }, [socket, user, listeners]);

    const value = React.useMemo(() => ({ socket, sendMessage }), [
        socket,
        sendMessage
    ])

    return (
        <WebSocketStateContext.Provider value={value} >
            <WebSocketDispatchContext.Provider value={dispatch}>
                {children}
            </WebSocketDispatchContext.Provider>
        </WebSocketStateContext.Provider>
    )
}

const useWebSocketState = () => {
    const context = React.useContext(WebSocketStateContext);
    if (context === undefined) {
        throw new Error(`useWebSocketState must be used within a WebSocketProvider`);
    }
    return context;
}

const useWebSocketDispatch = () => {
    const context = React.useContext(WebSocketDispatchContext);
    if (context === undefined) {
        throw new Error('useWebSocketDispatch must be used within a WebSocketProvider');
    }
    return context;
}

const useWebSocket = () => {
    const ws = useWebSocketState();
    const wsEvent = useWebSocketDispatch();
    return { ws, wsEvent };
}

export {WebSocketProvider, useWebSocketState, useWebSocketDispatch, useWebSocket}
// const ws = new WebSocket(`ws://localhost/api/?userId=${user.id}`);
// const msg = {
//     event: "host",
//     data: {
//         name: "classic",
//         password: "test",
//         host: "cafe8932-161d-4f85-b4d3-248520bdce6f",
//         rows: 6,
//         columns: 7,
//         align: 4,
//         acceleration: 9.7,
//         timeLimit: 30
//     }
// }
// if (ws !== null) {
//     ws.onopen = (() => {
//         ws.send(JSON.stringify(msg));
//     })
//     ws.onmessage = (e => {
//         console.log(JSON.parse(e.data));
//     })
// }
// }