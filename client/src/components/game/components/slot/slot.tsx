import React from 'react';
import { useComponentId } from '../../hooks';
import './slot.css';

const Slot = React.forwardRef<any, React.SVGProps<SVGSVGElement>>((props, ref) => {
    const myId = useComponentId();
    const { className } = props;
    return (
        <svg width="100%" height="100%" >
            <defs>
                <mask id={myId} x="0" y="0" width="100%" height="100%" >
                    <rect x="0" y="0" width="100%" height="100%" fill="white" />
                    <circle cx="50%" cy="50%" r="42%" />
                </mask>
            </defs>
            <rect ref={ref} className={className} x="0" y="0" width="100%" height="100%" mask={"url(#" + myId + ")"} />
        </svg>
    );
})

export default Slot