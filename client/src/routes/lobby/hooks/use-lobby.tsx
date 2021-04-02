import React, { useEffect, useReducer, useState } from 'react';
import { useQuery } from 'react-query';
import { useUser } from '../../../contexts/auth';
import { useWebSocket } from '../../../contexts/websocket';
import { API } from '../../../utils';

const getTime = (date: Date): string => {
    return date.toUTCString().split(' ')[4];
}

const playerReducer = (state: any, { status, id, alias }: any) => {
    if (!state) {
        return { id: { status, alias } };
    } else {
        const newState = { ...state };
        newState[id] = { status, alias };
        return newState;
    }
}

const useLobby = ({ match, aliases, colours }: any) => {
    const [messages, setMessages] = useState<JSX.Element[] | null>(null);
    const [players, playersDispatch] = useReducer(playerReducer, {});
    const [isReady, setIsReady] = useState(false);
    const [selectedColourIndex, setSelectedColourIndex] = useState<number | null>(null);
    const [enabledColours, setEnabledColours] = useState<number[] | null>(null);
    const [colourMap, setColourMap] = useState<any>(null);
    const user = useUser();
    const { ws, wsEvent } = useWebSocket();

    useEffect(() => {
        if (!enabledColours) {
            const pickedColours = Object.values<any>(aliases).map(alias => alias.colour_index);
            const remainingColours = colours.map((colour: any) => colour.index).filter((colourIndex: any) => !pickedColours.includes(colourIndex));
            ws.sendMessage('join', {
                gameId: match.id,
                playerId: user.data.id,
                name: user.data.username,
                colourIndex: remainingColours[0]
            });
            setEnabledColours(remainingColours);
            setSelectedColourIndex(remainingColours[0]);
            setColourMap(colours.reduce((map: any, colour: any) => {
                const {index, ...rest} = colour;
                map[colour.index] = rest;
                return map
            }, {}));
        }
    }, [])

    useEffect(() => {
        wsEvent({ type: 'add', event: 'update', callback: onUpdate });
        wsEvent({ type: 'add', event: 'join', callback: onJoin });
        wsEvent({ type: 'add', event: 'leave', callback: onLeave });
        return () => {
            wsEvent({ type: 'remove', event: 'update' });
            wsEvent({ type: 'remove', event: 'join' });
            wsEvent({ type: 'remove', event: 'leave' });
        }
    }, [colourMap]);

    const onUpdate = React.useCallback((data: any) => {
        const status = data.status === 'ready';
        const msg = status ? 'is ready' : 'is not ready';
        const alias = <span style={{ color: status ? colourMap[data.colour_index].id : '#ddd' }}> {data.alias} </span>;
        setEnabledColours(colours => {
            if (colours) {
                if (!status) {
                    return [...colours].concat(data.colour_index);
                } else {
                    return [...colours].filter(colour => colour !== data.colour_index);
                }
            } else {
                return colours
            }
        })
        playersDispatch({ status: data.status, id: data.player_id, alias: data.alias });
        setMessages(state => {
            if (!state) {
                return [<div> {`${getTime(new Date())}:`} {alias} {msg} </div>];
            } else {
                return [...state].concat(<div> {`${getTime(new Date())}:`} {alias} {msg} </div>)
            }
        })
    }, [colourMap]);

    const onJoin = React.useCallback((data: any) => {
        const alias = <span style={{ color: '#ddd' }}> {data.alias} </span>;
        setMessages(state => {
            if (!state) {
                return [<div> {`${getTime(new Date())}:`} {alias} has joined </div>];
            } else {
                return [...state].concat(<div> {`${getTime(new Date())}:`} {alias} has joined </div>)
            }
        })
        for (const alias of aliases) {
            playersDispatch({ status: alias.status, id: alias.player_id, alias: alias.alias });
        };
        playersDispatch({ status: 'unready', id: data.player_id, alias: data.alias });
    }, []);

    const onLeave = React.useCallback((data: any) => {
        const alias = <span style={{ color: '#ddd' }}> {data.alias} </span>;
        setMessages(state => {
            if (!state) {
                return [<div> {`${getTime(new Date())}:`} {alias} has left </div>];
            } else {
                return [...state].concat(<div> {`${getTime(new Date())}:`} {alias} has left </div>)
            }
        })
    }, []);


    const handleReady = React.useCallback(() => {
        if (selectedColourIndex !== null) {
            ws.sendMessage('update', {
                playerId: user.data.id,
                gameId: match.id,
                name: user.data.username,
                colourIndex: selectedColourIndex,
                status: !isReady ? 'ready' : 'unready'
            });
            setIsReady(!isReady);
        }
    }, [selectedColourIndex, isReady]);

    const handleStart = React.useCallback(() => {
        ws.sendMessage('start', {
            id: match.id,
            state: 'ongoing'
        });
    }, [match.id]);

    return {
        user,
        messages,
        selectedColourIndex,
        enabledColours,
        players,
        isReady,
        setSelectedColourIndex,
        handleReady,
        handleStart,
        colours
    }
}

export default useLobby;