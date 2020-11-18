import React, { useContext } from 'react'
import { DimensionSelectorContext } from '../../../Theme/DimensionSelectorContext'
import SlotCounter from './SlotCounter'
import Counter from '../../../../components/Counter'

function SlotCounters(props) {
    const { rows, } = useContext(DimensionSelectorContext);
    return (
        props.slotValues.map((_rows, i) =>
            <tr key={i} >
                {_rows.map((value, j) =>
                    <td key={(i * rows) + j} >
                        <div>
                            {value !== 0 &&
                                <SlotCounter
                                    value={props.currentValue}
                                    row={i}
                                    column={j}
                                    rows={rows}
                                    winningPositions={props.winningPositions}
                                    isGameEnd={props.isGameEnd}
                                    setIsCounterAnimationDone={props.setIsCounterAnimationDone}
                                >
                                    <Counter />
                                </SlotCounter>
                            }
                        </div>
                    </td>
                )}
            </tr >
        )
    );
}

function areEqual(prevProps, nextProps) {
    return (prevProps.currentValue === nextProps.currentValue) && (prevProps.isGameEnd === nextProps.isGameEnd);
}

export default React.memo(SlotCounters, areEqual);