import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { Refresh } from '../../routes/login/components/refresh';
import { API } from '../../utils';

interface IColour {
    id: string;
    name: string;
    index: number;
}

interface IMatchContext {
    id: string;
    name: string;
    host: string;
    rows: number;
    columns: number;
    align: number;
    acceleration: number;
    timeLimit: number;
    state: string;
    aliases: { id: string, alias: string, colourIndex: number }[];
    moves: any;
    colours: { id: string, name: string }[];
}

const MatchContext = React.createContext<IMatchContext | undefined>({} as IMatchContext);


function MatchContextProvider({ children, match, aliases, moves, colours }: any) {

    const values = React.useMemo(() => {
        const colourMap = colours.reduce((map: any, colour: any) => {
            const {index, ...rest} = colour;
            map[colour.index] = rest;
            return map
        }, {});
        const mutatedAliases = [];
        for (const alias of aliases) {
            const {colour_index, player_id, ...rest} = alias;
            mutatedAliases.push({ colourIndex: colour_index, id: player_id, ...rest});
        };
        return {
            ...match,
            aliases :mutatedAliases,
            colours: colourMap,
            moves
        }
    }, [match, aliases, colours, moves])

    return (
        <MatchContext.Provider value={values}>
            {children}
        </MatchContext.Provider>
    )
}

const useMatch = () => {
    const context = React.useContext(MatchContext);
    if (context === undefined) {
        throw new Error(`useMatch must be used within a MatchProvider`);
    }
    return context;
}

export { MatchContextProvider, useMatch }