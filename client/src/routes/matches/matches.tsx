import React, { useState } from 'react';
import { RouteConfig } from '../';
import { MatchList } from './components/match-list';
import './matches.css'

const Matches: React.FC<RouteConfig> = () => {
    const [name, setName] = useState('');
    const [state, setState] = useState('');
    const [host, setHost] = useState('');
    const [rows, setRows] = useState(0);
    const [columns, setColumns] = useState(0);
    const [acceleration, setAcceleration] = useState(0);
    const [align, setAlign] = useState(0);
    const [timeLimit, setTimeLimit] = useState(0);

    return (
        <div className='matches-page'>
            <div className='search-bar' >
                <div>
                    <input name='name' type='text' placeholder='name' />
                </div>
                <div>
                    <input name='host' type='text' placeholder='host' />
                </div>
                <div>
                    <input name='rows' type='number' placeholder='rows' />
                </div>
                <div>
                    <input name='columns' type='number' placeholder='columns' />
                </div>
                <div>
                    <input name='align' type='number' placeholder='counters to align' />
                </div>
                <div>
                    <input name='acceleration' type='number' placeholder='counter acceleration' />
                </div>
                <div>
                    <input name='time-limit' type='number' placeholder='seconds per turn' />
                </div>
                <div>
                    <select name='state'>
                        <option value="" > any </option>
                        <option value="waiting" >waiting</option>
                        <option value="ongoing" >ongoing</option>
                        <option value="complete" >complete</option>
                    </select>
                </div>
            </div>
            <MatchList
                name={name}
                state={state}
                host={host}
                rows={rows}
                columns={columns}
                acceleration={acceleration}
                align={align}
                timeLimit={timeLimit}
            />
        </div>
    )
}

export default Matches;