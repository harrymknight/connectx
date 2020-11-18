import React, { useEffect, useRef, useState } from 'react'
import { Transition } from 'react-transition-group'
import { usePrevious } from '../../../../../hooks/usePrevious'
import anime from 'animejs'
import './style.css'

const ANIMATION_DONE_EVENT = 'animation::done';

const colours =
    ['#e6194b',
        '#3cb44b',
        '#ffe119',
        '#4363d8',];

function InputCounter(props) {
    const [isClicked, setIsClicked] = useState(false);
    const prevValue = usePrevious(props.value);
    const onGameStart = () => {
        props.setWasClick(false);
    };
    const nodeRef = useRef(null);

    const triggerAnimationDoneEvent = () => {
        nodeRef.current.dispatchEvent(new Event(ANIMATION_DONE_EVENT))
    }

    const addEndListener = (done) => {
        nodeRef.current.addEventListener(ANIMATION_DONE_EVENT, done);
    }

    useEffect(() => {
        if (prevValue !== props.value && prevValue !== undefined) {
            props.setWasClick(true);
        }
    }, [prevValue, props])

    useEffect(onGameStart, []);

    const fadeOutOrSwitch = () => {
        const colour = props.value - 2 >= 0 ? colours[props.value - 2] : colours[colours.length - 1];
        isClicked ? anime({
            targets: nodeRef.current,
            opacity: [1, 0],
            fill: [colour, 'rgb(0, 0, 0)'],
            stroke: ['rgb(0, 0, 0)', 'rgb(0, 0, 0)'],
            easing: 'linear',
            duration: 200,
            complete: () => {
                triggerAnimationDoneEvent();
                props.setWasClick(false);
            }
        })
            : anime({
                targets: nodeRef.current,
                opacity: [0, 1],
                fill: ['rgb(0, 0, 0)', colours[props.value - 1]],
                stroke: ['rgb(0, 0, 0)', 'rgb(0, 0, 0)'],
                duration: 0,
                complete: () => triggerAnimationDoneEvent()
            })
    }

    const fadeIn = () => {
        anime({
            targets: nodeRef.current,
            opacity: [0, 1],
            fill: ['rgb(0, 0, 0)', colours[props.value - 1]],
            stroke: ['rgb(0, 0, 0)', 'rgb(0, 0, 0)'],
            easing: 'linear',
            duration: isClicked ? 200 : 0,
            complete: () => {
                triggerAnimationDoneEvent();
                if (isClicked) {
                    setIsClicked(false);
                }
            }
        })
    }

    return (
        <button
            className="input-counter"
            onClick={() => {
                props.onClick(props.index)
                setIsClicked(true)
            }}
        >
            <div>
                <Transition in={props.wasClick} nodeRef={nodeRef} onEnter={fadeOutOrSwitch} onExit={fadeIn} addEndListener={addEndListener} >
                    {React.cloneElement(props.children, { ref: nodeRef })}
                </Transition>
            </div>
        </button >
    );

}

export default InputCounter