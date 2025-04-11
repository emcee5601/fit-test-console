import {ProtocolSelectorWidget0} from "./ProtocolSelectorWidget0.tsx";

/**
 * Puts a border around a ProtocolSelectorWidget0
 * @constructor
 */
export function ProtocolSelectorWidget1() {
    return (
        <fieldset className={"info-box-compact"}>
            <legend>Protocol</legend>
            <ProtocolSelectorWidget0/>
        </fieldset>
    )
}
