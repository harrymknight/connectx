import React, { useState, useEffect, useRef, useContext } from 'react'
import { DimensionSelectorContext } from '../../../../Theme/DimensionSelectorContext'
import { Transition } from 'react-transition-group'
import anime from 'animejs'

const colours =
    ['#e6194b',
        '#3cb44b',
        '#ffe119',
        '#4363d8',]

const ANIMATION_DONE_EVENT = 'animation::done';

const g = 0.0098;
const _g = 1 / g;

function getFreeFallHeightAtTime(initialHeight, time) {
    return g * time * time * 0.5 + initialHeight;
}

function getFreeFallTimeFromHeight(initialHeight, position) {
    return Math.sqrt(2 * (position - initialHeight) * _g);
}

function SlotCounter(props) {
    const { rows, } = useContext(DimensionSelectorContext);
    const [isOccupied, setIsOccupied] = useState(true);
    const [isWinning, setIsWinning] = useState(false);
    const nodeRef = useRef(null);
    const triggerAnimationDoneEvent = () =>
        nodeRef.current.dispatchEvent(new Event(ANIMATION_DONE_EVENT));

    const addEndListener = (done) =>
        nodeRef.current.addEventListener(ANIMATION_DONE_EVENT, done);

    useEffect(() => {
        if (props.isGameEnd) {
            setIsOccupied(false);
        }
    }, [props.isGameEnd])

    useEffect(() => {
        for (let position of props.winningPositions) {
            if (position[0] === props.row && position[1] === props.column) {
                setIsWinning(true);
            }
        }
    }, [props.winningPositions, props.row, props.column])

    const dropCounter = () => {
        const colour = props.value - 2 >= 0 ? colours[props.value - 2] : colours[colours.length - 1];
        const slotSize = parseInt(window.getComputedStyle(nodeRef.current).width);
        const initialHeight = -(props.row + 1) * slotSize;
        const enterTime = getFreeFallTimeFromHeight(initialHeight, 0);
        const _enterDistance = 1 / getFreeFallHeightAtTime(initialHeight, 0);
        anime({
            targets: nodeRef.current,
            translateY: [initialHeight, 0],
            duration: enterTime,
            stroke: ["rgb(0,0,0)", "rgb(0,0,0)"],
            fill: [colour, colour],
            easing: function (el, i, total) {
                return function (t) {
                    return 1 - getFreeFallHeightAtTime(initialHeight, t * enterTime) * _enterDistance;
                }
            },
            complete: () => triggerAnimationDoneEvent()
        })
    }

    const removeCounter = () => {
        const slotSize = parseInt(window.getComputedStyle(nodeRef.current).width);
        const initialHeight = -(props.row + 1) * slotSize;
        const enterTime = getFreeFallTimeFromHeight(initialHeight, 0);
        const _enterDistance = 1 / getFreeFallHeightAtTime(initialHeight, 0);
        let delayTime = 0
        if (isWinning) {
            const totalHeight = rows * slotSize;
            delayTime = getFreeFallTimeFromHeight(initialHeight, (initialHeight + totalHeight)) * 5 + 500;
        }
        anime({
            targets: nodeRef.current,
            delay: delayTime,
            opacity: 0,
            duration: enterTime * 5,
            easing: function (el, i, total) {
                return function (t) {
                    return 1 - getFreeFallHeightAtTime(initialHeight, t * enterTime) * _enterDistance;
                }
            },
            complete: () => {
                triggerAnimationDoneEvent()
                if (isWinning && Math.max.apply(Math, props.winningPositions.map(position => position[0])) === props.row) {
                    props.setIsCounterAnimationDone(true);
                } else if (props.winningPositions.length === 0 && (props.row + 1) === rows) {
                    props.setIsCounterAnimationDone(true);
                }
            }
        })
    }

    return (
        <Transition appear in={isOccupied} nodeRef={nodeRef} onEnter={dropCounter} onExit={removeCounter} addEndListener={addEndListener} >
            {React.cloneElement(props.children,  { ref: nodeRef })}
        </Transition>
    );
}

export default SlotCounter