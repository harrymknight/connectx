import React, { useContext, useEffect, useState } from 'react'
import { CSSTransition } from 'react-transition-group'
import { useElementDimensions } from '../../../hooks/useElementDimensions'
import { DimensionSelectorContext } from '../../Theme/DimensionSelectorContext'
import InputCounters from './InputCounters'
import SlotCounters from './SlotCounters'
import BoardSlots from './BoardSlots'
import './style.css'

function Board(props) {

    const { rows, columns } = useContext(DimensionSelectorContext);
    const [setBoardRef, boardRef, boardDimensions] = useElementDimensions();
    const [isCounterAnimationDone, setIsCounterAnimationDone] = useState(false);
    const [initialState, setInitialState] = useState(false);

    useEffect(() => {
        setInitialState({
            isCounterAnimationDone: false,
        })
    }, []);

    useEffect(() => {
        if (boardDimensions !== null) {
            const slotHeight = boardDimensions.height / (rows + 1);
            const slotWidth = boardDimensions.width / (columns + 1);
            const slotSize = Math.floor(slotHeight < slotWidth ? slotHeight : slotWidth);
            boardRef.current.style.setProperty('--slot-size', slotSize + "px");
        }
    }, [boardRef, boardDimensions, columns, rows]);

    useEffect(() => {
        if (props.isAnimationDone) {
            setIsCounterAnimationDone(initialState.isCounterAnimationDone);
        }
    }, [props.isAnimationDone, initialState]);

    return (
        <CSSTransition
            in={props.isMenu}
            nodeRef={boardRef}
            timeout={500}
            classNames="board-shift"
        >
            <div ref={setBoardRef} className="board" >
                <table>
                    <tbody>
                        {!props.isAnimationDone &&
                            <InputCounters
                                currentValue={props.currentValue}
                                onGlobalClick={props.onClick}
                                isCounterAnimationDone={isCounterAnimationDone}
                                setIsAnimationDone={props.setIsAnimationDone}
                                isGameEnd={props.isGameEnd}
                            />
                        }
                    </tbody>
                </table>
                <div className="board-display" >
                    <table className="board-slots" >
                        <tbody>
                            <BoardSlots
                                slotValues={props.slotValues}
                                isCounterAnimationDone={isCounterAnimationDone}
                            />
                        </tbody>
                    </table>
                    <table>
                        <tbody>
                            <SlotCounters
                                slotValues={props.slotValues}
                                currentValue={props.currentValue}
                                winningPositions={props.winningPositions}
                                isGameEnd={props.isGameEnd}
                                setIsCounterAnimationDone={setIsCounterAnimationDone}
                            />
                        </tbody>
                    </table>
                </div>
            </div>
        </CSSTransition>
    );
}

export default Board;