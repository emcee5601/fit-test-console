/**
 * inspired by https://css-tricks.com/using-requestanimationframe-with-react-hooks/
 */
import {DependencyList, useEffect, useRef} from "react";


type UseAnimationFrameCallbackProps = {
    frameCurrentTime: number,
}

/**
 *
 * @param callback
 * @param clockStartTime
 * @param deps
 */
export function useAnimationFrame(callback: (props: UseAnimationFrameCallbackProps) => void, deps:DependencyList) {
    const lastRequestRef = useRef<number>();
    const frameStartTimeRef= useRef<number>()

    const animate = (currentFrameTime: number) => {
        if(frameStartTimeRef.current === undefined) {
            frameStartTimeRef.current = currentFrameTime;
        }
        callback({frameCurrentTime: currentFrameTime});
        lastRequestRef.current = requestAnimationFrame(animate)
    }

    useEffect(() => {
        lastRequestRef.current = requestAnimationFrame(animate)
        return () => {
            if (lastRequestRef.current) {
                cancelAnimationFrame(lastRequestRef.current)
            }
        }
    }, deps);
}
