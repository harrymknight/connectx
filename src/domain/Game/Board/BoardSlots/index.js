import React, { useContext } from 'react'
import { DimensionSelectorContext } from '../../../Theme/DimensionSelectorContext'
import BoardSlot from './BoardSlot'
import Slot from '../../../../components/Slot'

function BoardSlots(props) {
    const { rows, } = useContext(DimensionSelectorContext);
    return (
        props.slotValues.map((_row, i) =>
            <tr key={i} >
                {_row.map((_column, j) =>
                    <td key={i * rows + j} >
                        <div>
                            <BoardSlot
                                row={i}
                                column={j}
                                state={props.isCounterAnimationDone}
                            >
                                <Slot />
                            </BoardSlot>
                        </div>
                    </td>
                )}
            </tr>
        )
    );
}

function areEqual(prevProps, nextProps) {
    return prevProps.isCounterAnimationDone === nextProps.isCounterAnimationDone;
}

export default React.memo(BoardSlots, areEqual);