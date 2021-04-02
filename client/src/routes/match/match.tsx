import React, { useEffect } from 'react';
import { useQuery } from 'react-query';
import { useHistory, useParams } from 'react-router-dom';
import { RouteConfig } from '..';
import { useWebSocketDispatch } from '../../contexts/websocket';
import { API } from '../../utils';
import { Refresh } from '../login/components/refresh';
import { RenderRoutes } from '../utils';

const separatedName = (matchName: string) => {
    let end = 0;
    for (let i = 0; i < matchName.length; i++) {
        if (matchName[i].toUpperCase() === matchName[i]) {
            end = i;
        };
    };
    const firstPart = matchName.slice(0, end);
    const secondPart = matchName.charAt(end).toLowerCase() + matchName.slice(end + 1);
    return `${firstPart} ${secondPart}`;
}

const fetchMatch = async ({ queryKey }: any) => {
    const [_key, matchName] = queryKey;
    const name = separatedName(matchName);
    const match = await API.post('/match', { name });
    const matchData = match.data[0];
    const id = matchData.id;
    const related = await API.get(`/match/${id}`);
    const relatedData = related.data;
    return { match: matchData, ...relatedData };
}

const fetchColours = async () => {
    const colours = await API.get('/colours')
    return colours.data;
}

const Match: React.FC<RouteConfig> = ({ routes }) => {
    const { matchName } = useParams<{ matchName: string }>();
    const match = useQuery<any, Error, any>(['match', matchName], fetchMatch);
    const colours = useQuery('colours', fetchColours, {refetchOnWindowFocus: false });

    const history = useHistory();
    const wsEvent = useWebSocketDispatch();

    useEffect(() => {
        wsEvent({ type: 'add', event: 'start', callback: onStart });
        return () => {
            wsEvent({type: 'remove', event: 'start'});
        }
    }, []);

    const onStart = React.useCallback(() => {
        match.refetch();
    }, []);

    useEffect(() => {
        const status = match.data?.match.state;
        if (status === 'waiting') {
            history.replace(`/${matchName}/lobby`, { ...match.data, colours: colours.data });
        } else if (status === 'ongoing') {
            history.replace(`/${matchName}/play`, { ...match.data, colours: colours.data });
        } else if (status === 'complete') {
            history.replace(`/${matchName}/complete`, { ...match.data, colours: colours.data });
        }
    }, [match.data, colours.data]);

    if (match.isLoading || colours.isLoading) {
        return <Refresh />;
    } else if (match.isError || colours.isError) {
        return (
            <div>
                {match.error || colours.error};
                <Refresh />
            </div>
        );
    }
    return (
        <RenderRoutes routes={routes} />
    )
};

export default Match;