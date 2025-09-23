import {useEffect, useRef} from 'react'
import functionPlot, {FunctionPlotOptions} from 'function-plot'

export function FunctionPlot(props: Omit<FunctionPlotOptions, 'target'>) {
    const rootEl = useRef(null)

    useEffect(() => {
        try {
            functionPlot(Object.assign({}, props as FunctionPlotOptions, {target: rootEl.current}))
        } catch (e) {
            console.error(e)
        }
    })

    return (
        <div id={"function-plot-container"}>
            <style id={"function-plot-custom-styles"}>
                {/*override path.line style to 50% opacity so the filled in areas can be seen through each other*/}
                {`path.line { opacity: 0.5;}`}
            </style>
            <div ref={rootEl}/>
        </div>
    )
}
