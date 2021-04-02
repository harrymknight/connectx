import React from 'react';
import './counter.css';

const Counter = React.forwardRef<any, React.SVGProps<SVGSVGElement>>((props, ref) => {
    const {className, fill, stroke} = props;
    return <svg ref={ref} className={className} width="100%" height="100%" >
        <circle
            cx="50%"
            cy="50%"
            r="42%"
            strokeWidth="4%"
            fill={fill}
            stroke={stroke}
        />
    </svg>
}
)

export default Counter;