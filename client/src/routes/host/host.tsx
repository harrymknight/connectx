import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useHistory } from 'react-router-dom';
import { RouteConfig } from '..';
import { useUser } from '../../contexts/auth';
import { useWebSocket } from '../../contexts/websocket';
import { API } from '../../utils';
import './host.css';

const fetchMatchWords = async () => {
    return API.get('words/?amount=10000');
}

const Host: React.FC<RouteConfig> = () => {
    const { isLoading, isError, isSuccess, data } = useQuery('matchName', fetchMatchWords);
    const user = useUser();
    const [name, setName] = useState('');
    const [conjoinedName, setConjoinedName] = useState('');
    const [password, setPassword] = useState('');
    const [rows, setRows] = useState(6);
    const [columns, setColumns] = useState(7);
    const [countersToAlign, setCountersToAlign] = useState(4);
    const [timeLimit, setTimeLimit] = useState(30);
    const [counterAcceleration, setCounterAcceleration] = useState(9.79);
    const { ws, wsEvent } = useWebSocket();

    const isCreated = React.useCallback((data: any) => {
        if (data) {
            history.push(`/${conjoinedName}`);
        }
    }, [conjoinedName]);

    useEffect(() => {
        wsEvent({type: 'add', event: 'host', callback: isCreated});
        return () => {
            wsEvent({type: 'remove', event: 'host'});
        };
    }, [isCreated]);

    const history = useHistory();
    const handleSubmit = async () => {
        ws.sendMessage('host', {
            name,
            password,
            host: user.data.id,
            rows,
            columns,
            align: countersToAlign,
            timeLimit,
            acceleration: counterAcceleration
        })
    };

    if (isSuccess) {
        if (!name) {
            const words = data?.data.rows;
            const pair: string[] = [];
            const pass = words[Math.floor(Math.random() * words.length)].id;
            while (pair.length < 2) {
                const newWord = words[Math.floor(Math.random() * words.length)];
                if (newWord.class === 'adjective' && pair.length === 0) {
                    pair.push(newWord.id);
                } else if (newWord.class === 'noun' && pair.length === 1) {
                    pair.push(newWord.id);
                }
            }
            setName(`${pair[0]} ${pair[1]}`);
            setConjoinedName(`${pair[0]}${pair[1].charAt(0).toUpperCase() + pair[1].slice(1)}`)
            setPassword(pass);
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name } = e.target;
        switch (name) {
            case "name":
                setName(e.target.value);
                break;
            case "password":
                setPassword(e.target.value);
                break;
            case "rows":
                setRows(+e.target.value);
                break;
            case "columns":
                setColumns(+e.target.value);
                break;
            case "countersToAlign":
                setCountersToAlign(+e.target.value);
                break;
            case "timeLimit":
                setTimeLimit(+e.target.value);
                break;
            case "counterAcceleration":
                setCounterAcceleration(+e.target.value);
        }
    }

    return (
        <div className='host-page' >
            <form>
                <div>
                    <label> name </label>
                    <label> password </label>
                    <label> rows </label>
                    <label> columns </label>
                    <label> counters to align </label>
                    <label> seconds per turn </label>
                    <label> counter acceleration </label>
                </div>
                <div>
                    <input name='name' type='text' value={name} onChange={handleInputChange} />
                    <input name='password' type='text' value={password} onChange={handleInputChange} />
                    <input name='rows' type='number' value={rows} onChange={handleInputChange} />
                    <input name='columns' type='number' value={columns} onChange={handleInputChange} />
                    <input name='countersToAlign' type='number' value={countersToAlign} onChange={handleInputChange} />
                    <input name='timeLimit' type='number' value={timeLimit} onChange={handleInputChange} />
                    <input name='counterAcceleration' type='range' value={counterAcceleration} onChange={handleInputChange} min='0.01' max='9.79' />
                </div>
            </form>
            <button onClick={handleSubmit} >
                submit
            </button>
        </div>
    )
}

export default Host;