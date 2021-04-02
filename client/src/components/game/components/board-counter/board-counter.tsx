import React, { useRef } from 'react';
import { CSSTransition } from 'react-transition-group';
import { useMatch } from '../../../../contexts/match';
import { Counter } from '../../../counter';
import './board-counter.css';

const BoardCounter: React.FC<any> = ({ value, index, i, displayRef }) => {
    const { colours } = useMatch();
    const counterRef = useRef<SVGElement | null>(null);
    const counterContainer = useRef<HTMLDivElement>(null);

    const addEndListener = (done: any) => {
        // use the css transitionend event to mark the finish of a transition
        if (counterContainer.current) {
            counterContainer.current.addEventListener('transitionend', done, false);
        }
    };

    const onCounterEnter = () => {
        if (counterContainer.current) {
            const slotSize = parseInt(displayRef.current.style.getPropertyValue('--slot-size').split('px')[0]);
            counterContainer.current.style.setProperty('--height', `${slotSize * (i + 1)}px`);
            counterContainer.current.style.setProperty('--time', `${Math.sqrt(2 * 9.8 * (slotSize * (index + 1))) * 10}ms`)
        }
    }

    return (
        <CSSTransition
            enter
            key={`board-counter-${index}${i}`}
            nodeRef={counterContainer}
            in={value !== 0}
            classNames='board-counter'
            onEnter={onCounterEnter}
            addEndListener={addEndListener}
        >
            <div ref={counterContainer} >
                {value ? <Counter ref={counterRef} fill={colours[value].id} stroke={'#000000'} /> : null}
            </div>
        </CSSTransition>
    )
}

export default BoardCounter