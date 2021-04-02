import React, { useLayoutEffect, useState } from 'react';
import './match-item.css';

const MatchItem: React.FC<any> = (props) => {
    const [location, setLocation] = useState('');
    const [numberOfFields, setNumberOfFields] = useState(0);
    const { index, click, setClick, amount, ...rest } = props;

    useLayoutEffect(() => {
        if (index === 0) {
            setLocation("top");
        } else if (index === amount - 1) {
            setLocation("bottom");
        } else {
            setLocation("middle");
        }
        setNumberOfFields(Object.keys(rest).length);
    }, [])

    return (
        <button
            className={"match-item " + location}
            onClick={() => setClick(index)}>
            {Object.entries(rest).map((entry, position) => {
                const isClicked = click === index ? "clicked " : "";
                const isEnd = (position === numberOfFields - 1) ? "end" : "";
                return (
                    <div className={isClicked + isEnd}>
                        {entry[1] as string}
                    </div>
                )
            })}
        </button>
    )
};

export default MatchItem;