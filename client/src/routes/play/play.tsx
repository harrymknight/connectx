import React from 'react';
import { Game } from '../../components/';
import { MatchContextProvider } from '../../contexts/match';



const Play: React.FC<any> = ({ location }) => {
    const { state } = location;
    const { match, aliases, moves, colours } = state;

    return (
        <MatchContextProvider match={match} aliases={aliases} moves={moves} colours={colours}>
            <Game />
        </MatchContextProvider>
    )
}

export default Play;