import { useEffect, useState } from 'react'

function getMousePosition(event) {
    return {
        x: event.clientX,
        y: event.clientY
    };
}


export function useMousePosition() {
    const [mousePosition, setMousePosition] = useState({x: 0, y: 0});

    useEffect(() => {
        function handleMouseMove(event) {
            setMousePosition(getMousePosition(event));
        }

        window.addEventListener("mousemove", handleMouseMove)
        return () => window.removeEventListener("mousemove", handleMouseMove)
    })
    return mousePosition;
};