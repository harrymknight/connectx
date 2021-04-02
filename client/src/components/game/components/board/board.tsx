import React, { useState } from 'react';
import { useMatch } from '../../../../contexts/match';
import { BoardCounterColumn } from '../board-counter-column';
import { BoardSlot } from '../board-slot';
import { Slot } from '../slot';
import './board.css';

const Board: React.FC<any> = ({ slotValues, displayRef }) => {
    const { rows, columns } = useMatch();
    return (
        <div className="board-container">
            <div className="board" >
                {slotValues.map((column: number[], i: number) => <BoardCounterColumn column={column} index={i} displayRef={displayRef} />)}
            </div>
            <div className="board" >
                {Array(rows * columns).fill(null).map((_, i) => 
                    <BoardSlot index={i} />
                )}
            </div>
        </div>
    )
}

export default Board