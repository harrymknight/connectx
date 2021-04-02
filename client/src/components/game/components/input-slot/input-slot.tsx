import React from 'react';
import { useUser } from '../../../../contexts/auth';
import { useMatch } from '../../../../contexts/match';
import { useWebSocketState } from '../../../../contexts/websocket';
import { Counter } from '../../../counter';
import './input-slot.css';

const InputSlot: React.FC<any> = ({ forwardedKey, state, index, currentIndex, attemptMove, isGameEnd }) => {
    const { id, aliases, colours, rows } = useMatch();
    const user = useUser();
    const ws = useWebSocketState();
    const handleClick: React.MouseEventHandler<HTMLButtonElement> = React.useCallback((e) => {
        e.preventDefault();
        if (user.data.id === aliases[currentIndex].id) {
            attemptMove(rows - 1, index);
        };
    }, [attemptMove, currentIndex]);

    const handleHover: React.MouseEventHandler<HTMLButtonElement> = React.useCallback((e) => {
        e.preventDefault();
        if (!isGameEnd && (aliases[currentIndex].id === user.data.id)) {
            ws.sendMessage('hover', {
                gameId: id,
                index,
                state
            })
        }
    }, [state, currentIndex, isGameEnd]);

    return (
        <button key={forwardedKey} className='input-slot' onMouseEnter={handleHover} onMouseLeave={handleHover} onClick={handleClick}>
            {state ? <Counter fill={colours[aliases[currentIndex].colourIndex].id} stroke='#000000' /> : null}
        </button>
    )
};

export default InputSlot;