import React, { useEffect, useState } from 'react';
import { useMatch } from '../../../../contexts/match';
import { useWebSocket } from '../../../../contexts/websocket';
import { InputSlot } from '../input-slot';
import './input-row.css';

const InputRow: React.FC<any> = ({ currentIndex, attemptMove, isGameEnd }) => {
    const { colours, columns, aliases } = useMatch();
    const [inputStates, setInputStates] = useState<boolean[]>(Array(columns).fill(false));
    const { ws, wsEvent } = useWebSocket();

    const onHover = React.useCallback((data: any) => {
        setInputStates((states: any) => {
            const newStates = [...states];
            newStates[data.index] = !data.state;
            return newStates;
        });
    }, [setInputStates]);

    useEffect(() => {
        wsEvent({type: 'add', event: 'hover', callback: onHover})
    }, [setInputStates]);

    return (
        <div className="input-row" >
            {inputStates.map((state, index) =>
                <InputSlot
                    forwardedKey={`input-row-${index}`}
                    index={index}
                    state={state}
                    currentIndex={currentIndex}
                    attemptMove={attemptMove}
                    isGameEnd={isGameEnd}
                />
            )}
        </div>
    )
}

export default InputRow;