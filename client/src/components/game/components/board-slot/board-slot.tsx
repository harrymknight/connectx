import React from 'react';
import { Slot } from '../slot';

const BoardSlot: React.FC<any> = ({ index }) => {
    return (
        <div key={`board-slot-${index}`}>
            <Slot className="board" />
        </div>
    )
}

export default BoardSlot;