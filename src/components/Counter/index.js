import React from 'react'
import './style.css'

const Counter = React.forwardRef((props, ref) =>
    <svg ref={ref} className={props.className} width="100%" height="100%" >
        <circle
            cx="50%"
            cy="50%"
            r="42%"
            strokeWidth="4%"
        />
    </svg>
)

export default Counter