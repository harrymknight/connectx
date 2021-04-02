import { useState, useRef, useCallback } from 'react'
import ResizeObserver from 'resize-observer-polyfill';

export function useElementDimensions() {
    const [elementDimensions, setElementDimensions] = useState<any>(null);
    const ref = useRef<any>(null);
    const setRef = useCallback(node => {
        const ro = new ResizeObserver((entries: any) => {
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

export default useElementDimensions;