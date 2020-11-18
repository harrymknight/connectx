import React from 'react'
import useComponentId from '../../hooks/useComponentId'

const Slot = React.forwardRef((props, ref) => {
    const myId = useComponentId();
    return (
        <svg width="100%" height="100%" >
            <defs>
                <mask id={myId} x="0" y="0" width="100%" height="100%" >
                    <rect x="0" y="0" width="100%" height="100%" fill="white" />
                    <circle cx="50%" cy="50%" r="42%" />
                </mask>
            </defs>
            <rect ref={ref} x="0" y="0" width="100%" height="100%" mask={"url(#" + myId + ")"} />
        </svg>
    );
})

export default Slot