import React, { useContext, useEffect, useReducer, useState } from 'react'
import { DimensionSelectorContext } from '../Theme/DimensionSelectorContext'
import Board from './Board'
import './style.css'

const colours =
    ['#e6194b',
        '#3cb44b',
        '#ffe119',
        '#4363d8',]

function handleIsAnimationDone(_state, action) {
    return action
}

function Game(props) {
    const { rows, columns } = useContext(DimensionSelectorContext);
    const [slotValues, setSlotValues] = useState(Array(rows).fill(Array(columns).fill(0)));
    const [currentValue, setCurrentValue] = useState(1);
    const [isGameEnd, setIsGameEnd] = useState(false);
    const [winningPositions, setWinningPositions] = useState([]);
    const [isAnimationDone, setIsAnimationDone] = useReducer(handleIsAnimationDone, false);
    const [initialState, setInitialState] = useState(null);

    useEffect(() => {
        setInitialState({
            slotValues: Array(rows).fill(Array(columns).fill(0)),
            currentValue: 1,
            isGameEnd: false,
            winningPositions: []
        })
    }, [rows, columns])

    useEffect(() => {
        if (isAnimationDone) {
            setSlotValues(initialState.slotValues);
            setCurrentValue(initialState.currentValue);
            setIsGameEnd(initialState.isGameEnd);
            setWinningPositions(initialState.winningPositions);
            setIsAnimationDone(false);
        }
    }, [isAnimationDone, initialState])

    function attemptMove(i, j) {
        if (i < 0) {
            return { value: -2 };
        }
        if (slotValues[i][j] === 0) {
            const newSlotValues = Array(rows).fill(null).map((_value, i) => [...slotValues[i]]);
            newSlotValues[i][j] = currentValue;
            setSlotValues(newSlotValues);
            return getGameState(i, j, newSlotValues);
        } else {
            return attemptMove(i - 1, j);
        }
    }

    function handleClick(j) {

        if (isGameEnd) {
            return;
        }

        const resultOfMove = attemptMove(rows - 1, j)
        if (resultOfMove.value === -2) {
            return;
        } else if (resultOfMove.value !== -1) {
            setIsGameEnd(true);
            setWinningPositions(resultOfMove.positions);
        }

        const nextValue = (currentValue + 1) % (colours.length + 1)
        setCurrentValue(nextValue === 0 ? 1 : nextValue);

    }

    return (
        <div className='game' >
            <Board
                isMenu={props.isMenu}
                slotValues={slotValues}
                currentValue={currentValue}
                isGameEnd={isGameEnd}
                winningPositions={winningPositions}
                onClick={handleClick}
                isAnimationDone={isAnimationDone}
                setIsAnimationDone={setIsAnimationDone}
            />
        </div>
    );

}

function getGameState(row, column, slots) {
    // Going clockwise, pairing directions along line of symmetry
    // e.g. up and down (positive sign meaning downward or rightward)
    const constants = {
        row: row,
        column: column,
        slots: slots,
        directions: [[1, 0], [-1, 0], [1, 1], [-1, -1], [0, 1], [0, -1], [-1, 1], [1, -1]],
        positions: []
    }
    const propagatedDirections = Array(constants.directions.length).fill(null).map((_value, i) => ([...constants.directions[i]]));
    let scores = Array(constants.directions.length).fill(0);
    const result = {
        //By default the game is ongoing
        value: -1,
        positions: []
    }

    for (let i = 1; i < constants.directions.length; i += 2) {
        constants.positions = [[constants.row, constants.column]];
        scores[i - 1] = SumInDirection(constants, i - 1, propagatedDirections[i - 1], scores[i - 1]);
        scores[i] = SumInDirection(constants, i, propagatedDirections[i], scores[i]);
        const totalScore = scores[i] + scores[i - 1];
        //Sum scores along line of symmetry. If 3 or more counters of the
        //same colour have been encountered about the initial counter
        //the game has been won
        if (totalScore >= 3) {
            result.value = slots[row][column]
            result.positions = constants.positions;
        }
    }
    if (checkIfDraw(slots) === 0) {
        result.value = 0;
    }
    return result;
}

function SumInDirection(constants, i, propagatedDirection, score) {
    const rowToEvaluate = constants.row + propagatedDirection[0];
    const columnToEvaluate = constants.column + propagatedDirection[1];
    //Test to see if within boundary of grid
    if (rowToEvaluate > constants.slots.length - 1 || rowToEvaluate < 0 || columnToEvaluate > constants.slots[0].length - 1 || columnToEvaluate < 0) {
        return score;
    }
    const colourOfInitialPoint = constants.slots[constants.row][constants.column];
    const colourOfPointToEvaluate = constants.slots[rowToEvaluate][columnToEvaluate];
    if (colourOfPointToEvaluate === colourOfInitialPoint) {
        score += 1;
        propagatedDirection[0] += constants.directions[i][0];
        propagatedDirection[1] += constants.directions[i][1];
        constants.positions.push([rowToEvaluate, columnToEvaluate]);
        score = SumInDirection(constants, i, propagatedDirection, score);
    }
    return score;
}

function checkIfDraw(slots) {
    for (let i = 0; i < slots.length; i++) {
        for (let j = 0; j < slots[0].length; j++) {
            // If there is an empty position the game continues
            if (slots[i][j] === 0) {
                return -1;
            }
        }
    }
    // There are no remaining empty slots so the game is a draw
    return 0;
}

export default Game;