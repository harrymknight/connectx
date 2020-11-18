import React, { useContext, useRef } from 'react'
import { DimensionSelectorContext } from '../../../../Theme/DimensionSelectorContext'
import { Transition } from 'react-transition-group'
import anime from 'animejs'


const ANIMATION_DONE_EVENT = 'animation::done';

function BoardSlot(props) {
    const { rows, } = useContext(DimensionSelectorContext);
    const nodeRef = useRef(null);
    const triggerAnimationDoneEvent = () => {
        nodeRef.current.dispatchEvent(new Event(ANIMATION_DONE_EVENT))
    }

    const addEndListener = (done) => {
        nodeRef.current.addEventListener(ANIMATION_DONE_EVENT, done);
    }

    const fadeIn = () => {
        anime({
            targets: nodeRef.current,
            delay: (props.row + 1) * 80,
            fill: ["white", "rgb(26, 61, 138)"],
            opacity: [0, 1],
            easing: 'spring(1, 100, 30, 0)',
            duration: 200,
            complete: () => triggerAnimationDoneEvent()
        })
    }

    const fadeOut = () => {
        anime({
            targets: nodeRef.current,
            delay: (rows - (props.row + 1)) * 80,
            fill: ["rgb(26, 61, 138)", "white"],
            opacity: [1, 0],
            easing: 'spring(1, 100, 30, 0)',
            duration: 200,
            complete: () => {
                triggerAnimationDoneEvent()
            }
        })
    }

    return (
        <Transition appear unmountOnExit in={!props.state} nodeRef={nodeRef} onEnter={fadeIn} onExit={fadeOut} addEndListener={addEndListener} >
            {React.cloneElement(props.children, { ref: nodeRef })}
        </Transition>
    );
}

export default BoardSlot;