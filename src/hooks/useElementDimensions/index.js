import { useState, useRef, useCallback } from 'react'

export function useElementDimensions() {
    const [elementDimensions, setElementDimensions] = useState(null);
    const ref = useRef(null);
    const setRef = useCallback(node => {
        const ro = new ResizeObserver(entries => {
            for (let entry of entries) {
                const cr = entry.contentRect;
                setElementDimensions(cr);
            }
        })
        if (ref.current) {
            ro.unobserve(ref.current);
        }

        if (node) {
            ro.observe(node);
        }

        ref.current = node;
    }, [])

    return [setRef, ref, elementDimensions];
}