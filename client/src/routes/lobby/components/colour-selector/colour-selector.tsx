import React, { useCallback, useRef } from 'react';
import './colour-selector.css';

const ColourSelector: React.FC<any> = ({ colour, enabledColours, selectedColourIndex, setSelectedColourIndex, isReady}) => {
    const setContent = useCallback((node: HTMLButtonElement) => {
        if (node && enabledColours) {
            if (!enabledColours.includes(colour.index)) {
                node.style.color = '#fff';
            } else if (selectedColourIndex === colour.index) {
                node.style.color = '#ddd';
            } else {
                node.style.color = colour.id;
            }
        }
    }, [enabledColours, selectedColourIndex])
    return (
        <button key={colour.id} ref={setContent} className='colour-selector' onClick={() => !isReady ? setSelectedColourIndex(colour.index) : null}>
            {colour.name}
        </button>
    )
}

export default ColourSelector;