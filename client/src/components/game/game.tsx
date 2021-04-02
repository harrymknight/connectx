import React, { useEffect, useLayoutEffect, useReducer, useState } from 'react';
import { useUser } from '../../contexts/auth';
import { useMatch } from '../../contexts/match';
import { useWebSocket } from '../../contexts/websocket';
import { Board, InputRow } from './components';
import './game.css';
import { useElementDimensions } from './hooks';

const Game: React.FC<any> = () => {

    const { rows, columns, aliases, name, id, moves } = useMatch();
    const [slotValues, setSlotValues] = useState(Array(columns).fill(null).map(_column => (Array(rows).fill(0))));
    const [isGameEnd, setIsGameEnd] = useState(false);
    const [winningPositions, setWinningPositions] = useState(null);
    const user = useUser();
    const { ws, wsEvent } = useWebSocket();

    const setCurrentIndex = React.useCallback((state: any, action: any) => {
        switch (action.type) {
            case 'increment': {
                state += 1;
                break;
            };
            case 'decrement': {
                state -= 1;
                break;
            }
        }
        if (state < 0) {
            return aliases.length - 1;
        } else {
            state = state % aliases.length;
            return state;
        }
    }, [aliases]);

    const [turn, setTurn] = useState(0);
    const [currentIndex, dispatchCurrentIndex] = useReducer(setCurrentIndex, 0);
    const [setDisplayRef, displayRef, displayDimensions] = useElementDimensions();

    useLayoutEffect(() => {
        if (displayDimensions) {
            const slotWidth = displayDimensions.width / columns;
            const slotHeight = displayDimensions.height / (rows + 1);
            const slotSize = Math.floor(slotWidth > slotHeight ? slotHeight : slotWidth);
            const slotDiagonal = Math.sqrt(2 * slotSize * slotSize);
            displayRef.current.style.setProperty('--rows', `${rows}`);
            displayRef.current.style.setProperty('--columns', `${columns}`);
            displayRef.current.style.setProperty('--slot-size', `${slotSize}px`);
            displayRef.current.style.setProperty('--slot-diagonal', `${slotDiagonal}px`);
        }
    }, [displayDimensions])

    const onMove = React.useCallback(({ row, column, state }: any) => {
        console.log(row, column, state, aliases);
        if (isGameEnd) {
            return;
        }
        if (state.value === -2) {
            return;
        }
        const newSlotValues = Array(columns).fill(null).map((_value, i) => [...slotValues[i]]);
        newSlotValues[column][row] = aliases[currentIndex].colourIndex;
        setSlotValues(newSlotValues);
        if (state.value !== -1) {
            setIsGameEnd(true);
            setWinningPositions(state.positions);
            return;
        }
        setTurn(turn => turn + 1);
        dispatchCurrentIndex({ type: 'increment' });
    }, [slotValues, currentIndex, isGameEnd]);

    useLayoutEffect(() => {
        setSlotValues(slots => {
            const newSlots = Array(slots.length).fill(null).map((_column, i) => [...slots[i]]);
            for (const move of moves) {
                newSlots[move.column][move.row] = move.colour_index;
            };
            return newSlots;
        })
    }, [moves])

    useLayoutEffect(() => {
        if (moves.length !== 0) {
            console.table(moves);
            for (const alias of aliases) {
                if (alias.colourIndex === moves[moves.length - 1].colour_index) {
                    dispatchCurrentIndex({ type: 'increment' });
                    break;
                }
                dispatchCurrentIndex({ type: 'increment' });
            }
        };
    }, []);

    useEffect(() => {
        wsEvent({ type: 'add', event: 'move', callback: onMove });
        return () => {
            wsEvent({ type: 'remove', event: 'move' });
        }
    }, [onMove]);

    useEffect(() => {
        ws.sendMessage('host', {
            name
        });
    }, []);

    const attemptMove = React.useCallback((i: number, j: number): any => {

        if(isGameEnd) {
            return;
        }

        if (i < 0) {
            return { value: -2 };
        }
        if (slotValues[j][i] === 0) {
            ws.sendMessage('move', {
                playerId: user.data.id,
                gameId: id,
                row: i,
                column: j,
                turn
            })
        } else {
            return attemptMove(i - 1, j);
        }
    }, [slotValues, turn, isGameEnd]);

    return (
        <div className="game" >
            <div ref={setDisplayRef} className="game-display">
                <InputRow currentIndex={currentIndex} attemptMove={attemptMove} isGameEnd={isGameEnd} />
                <Board slotValues={slotValues} displayRef={displayRef} />
            </div>
            <div className="game-info">
                timer
            </div>
        </div>
    );
}

export default Game;