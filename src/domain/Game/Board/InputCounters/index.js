import React, { useContext, useState } from 'react'
import { DimensionSelectorContext } from '../../../Theme/DimensionSelectorContext'
import FadeContainer from '../../../../components/FadeContainer'
import InputCounter from './InputCounter'
import Counter from '../../../../components/Counter'


function InputCounters(props) {
    const { rows, columns } = useContext(DimensionSelectorContext);
    const [wasClick, setWasClick] = useState(true);
    return (
        <tr>
            {Array(columns).fill(null).map((value, i) =>
                <td key={i} >
                    {
                        <FadeContainer
                            inDelay={rows * 80}
                            outDelay={0}
                            easing='spring(1, 100, 30, 0)'
                            state={props.isCounterAnimationDone}
                            onFinish={i === 0 ? () => props.setIsAnimationDone(true) : () => {}}
                        >
                            <InputCounter
                                value={props.currentValue}
                                onClick={props.onGlobalClick}
                                wasClick={wasClick}
                                setWasClick={setWasClick}
                                index={i}
                            >
                                <Counter className="input" />
                            </InputCounter>
                        </FadeContainer>
                    }
                </td>
            )}
        </tr>
    );
}

export default InputCounters