import React, { useEffect, useState } from 'react'
import { useMousePosition } from '../../hooks/useMousePosition'
import { useWindowDimensions } from '../../hooks/useWindowDimensions'
import { DimensionSelectorContext } from '../../domain/Theme/DimensionSelectorContext'
import Game from '../../domain/Game'
import Menu from '../../domain/Menu'
import './style.css'

const App = () => {
    const [isMenu, setIsMenu] = useState(true);
    // const windowDimensions = useWindowDimensions();
    // const mousePosition = useMousePosition();
    // useEffect(() => {
    //     if (mousePosition.x < windowDimensions.width * 0.05) {
    //         if (!isMenu) {
    //             setIsMenu(true);
    //         }
    //     } else {
    //         if (isMenu) {
    //             setIsMenu(false);
    //         }
    //     }
    // }, [mousePosition, windowDimensions])
    return (
        <div className='flex-container' >
            <Menu isMenu={isMenu} />
            <DimensionSelectorContext.Provider value={{ rows: 6, columns: 7 }}>
                <Game isMenu={isMenu} />
            </DimensionSelectorContext.Provider>
        </div>
    );
}

export default App