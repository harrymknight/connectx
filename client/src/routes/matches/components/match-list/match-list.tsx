import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { API } from '../../../../utils';
import { Refresh } from '../../../login/components/refresh';
import { MatchAction } from '../match-action';
import { MatchItem } from '../match-item';
import './match-list.css';

interface IMatch {
    id?: string,
    name?: string,
    state?: string,
    host?: string,
    rows?: number,
    columns?: number,
    acceleration?: number,
    align?: number,
    timeLimit?: number,
    password?: string,
}

const MatchList: React.FC<IMatch> = ({ name, state, host, rows, columns, acceleration, align, timeLimit }) => {
    const [click, setClick] = useState(0);

    const fetchMatches = () => {
        const attributes: IMatch = {
            name,
            state,
            host,
            rows,
            columns,
            acceleration,
            align,
            timeLimit
        }
        const activeAttributes = Object.keys(attributes).reduce<any>((filtered, key) => {
            if (attributes[key as keyof IMatch]) {
                filtered[key as keyof IMatch] = attributes[key as keyof IMatch]
            }
            return filtered;
        }, {})
        return API.post('match', {
            ...activeAttributes
        })
    }

    const { isLoading, isError, data, error } = useQuery('matches', fetchMatches);

    if (isLoading) {
        return (
            <Refresh />
        )
    }

    return (
        <React.Fragment>
            <div className='matches-list'>
                {Array.from<IMatch>(data?.data).map((match, index) => {
                    const { id, ...rest } = match;
                    return <MatchItem key={id} index={index} amount={data?.data.length} click={click} setClick={setClick} {...rest} />
                })}
            </div>
            <MatchAction id={data?.data[click].id} name={data?.data[click].name} rows={data?.data[click].rows} columns={data?.data[click].columns}/>
        </React.Fragment>
    );
}

export default MatchList