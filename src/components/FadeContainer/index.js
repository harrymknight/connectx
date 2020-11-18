import React, { useRef } from 'react'
import { Transition } from 'react-transition-group'
import anime from 'animejs'
import './style.css'

function FadeContainer(props) {

    const nodeRef = useRef(null);

    const fadeIn = () => {
        anime({
            targets: nodeRef.current,
            delay: props.inDelay,
            duration: 200,
            opacity: [0, 1],
            easing: props.easing,
        })
    }

    const fadeOut = () => {
        anime({
            targets: nodeRef.current,
            delay: props.outDelay,
            duration: 200,
            opacity: [1, 0],
            easing: props.easing,
            complete: () => {
                props.onFinish();
            }
        })
    }

    return (
        <Transition appear in={!props.state} nodeRef={nodeRef} onEnter={fadeIn} onExit={fadeOut} timeout={200} >
            <div
                ref={nodeRef}
                className="fade-container"
            >
                {props.children}
            </div>
        </Transition>
    );
}

export default FadeContainer