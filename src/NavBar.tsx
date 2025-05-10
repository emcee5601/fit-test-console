import {NavLink, To, useNavigate} from "react-router";
import {useWakeLock} from "./use-wake-lock.ts";
import {EventTimeWidget} from "src/EventTimeWidget.tsx";
import {CurrentParticipantTimeWidget} from "src/CurrentParticipantTimeWidget.tsx";
import {useSetting} from "src/use-setting.ts";
import {AppSettings} from "src/app-settings.ts";
import {BrowserDetect} from "src/BrowserDetect.tsx";
import {ConnectionStatusWidget} from "src/ConnectionStatusWidget.tsx";
import {SampleSourceWidget} from "src/SampleSourceWidget.tsx";
import {ControlSourceWidget} from "src/ControlSourceWidget.tsx";

export function NavBar() {
    const [showParticipantTime] = useSetting<boolean>(AppSettings.SHOW_ELAPSED_PARTICIPANT_TIME)
    const [showEventTime] = useSetting<boolean>(AppSettings.SHOW_REMAINING_EVENT_TIME)
    const navigate = useNavigate();

    useWakeLock()

    function itemSelected(event: { target: { value: To; }; }) {
        console.debug(`itemSelected: ${JSON.stringify(event.target.value)}`)
        navigate(event.target.value);
    }

    return (
        <>
            <div id="nav-bar-container" style={{display: "flex", justifyContent: "space-between"}}>
                <CurrentParticipantTimeWidget style={{visibility: showParticipantTime ? "visible" : "hidden"}}/>
                <div className={"inline-flex"} style={{width: 'fit-content'}}>
                    <ConnectionStatusWidget/><ControlSourceWidget/><SampleSourceWidget/>
                </div>
                <select className="narrow-nav-links" onChange={itemSelected}>
                    <option value={"/"}>Home</option>
                    <option value={"/estimate"}>Estimate</option>
                    <option value={"/view-results"}>Results</option>
                    <option value={"/settings"}>Settings</option>
                    <option value={"/protocols"}>Protocols</option>
                    <option value={"/raw-data"}>Raw&nbsp;Data</option>
                    <option value={"/stats"}>Stats</option>
                    <option value={"/qrscanner"}>QR Scanner</option>
                </select>
                <div className="wide-nav-links">
                    <NavLink to={"/"}>Home</NavLink>
                    | <NavLink to={"/estimate"}>Estimate</NavLink>
                    | <NavLink to={"/view-results"}>Results</NavLink>
                    | <NavLink to={"/settings"}>Settings</NavLink>
                    | <NavLink to={"/protocols"}>Protocols</NavLink>
                    | <NavLink to={"/raw-data"}>Raw&nbsp;Data</NavLink>
                    | <NavLink to={"/stats"}>Stats</NavLink>
                    {<>| <NavLink to={"/qrscanner"}>QR Scanner</NavLink></>}
                </div>
                <EventTimeWidget style={{visibility: showEventTime ? "visible" : "hidden"}}/>
                {/*<NewSettingsNotifier/> this interferes with browser detection redirect, since this also redirects*/}
            </div>
            <BrowserDetect/>
        </>
    )
}
