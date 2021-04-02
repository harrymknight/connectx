import React, { useState } from 'react';
import { useMatch } from '../../../../contexts/match';
import { BoardCounter } from '../board-counter';


const BoardCounterColumn: React.FC<any> = ({column, index, displayRef}) => {
    return (
        <React.Fragment>
            {column.map((value: number, i: number) => <BoardCounter value={value} index={index} i={i} displayRef={displayRef} />)}
        </React.Fragment>
    )
}

export default BoardCounterColumn;