import {NavLink, To, useLocation, useNavigate} from "react-router";
import {useWakeLock} from "./use-wake-lock.ts";
import {EventTimeWidget} from "src/EventTimeWidget.tsx";
import {CurrentParticipantTimeWidget} from "src/CurrentParticipantTimeWidget.tsx";
import {useSetting} from "src/use-setting.ts";
import {AppSettings} from "src/app-settings.ts";
import {BrowserDetect} from "src/BrowserDetect.tsx";
import {SampleSourceWidget} from "src/SampleSourceWidget.tsx";
import {ControlSourceWidget} from "src/ControlSourceWidget.tsx";
import {PortaCountCommandWidget} from "src/PortaCountCommandWidget.tsx";
import {DriverSelectorWidget} from "src/DriverSelectorWidget.tsx";

export function NavBar() {
    const [showParticipantTime] = useSetting<boolean>(AppSettings.SHOW_ELAPSED_PARTICIPANT_TIME)
    const [showEventTime] = useSetting<boolean>(AppSettings.SHOW_REMAINING_EVENT_TIME)
    const [compactUi] = useSetting<boolean>(AppSettings.USE_COMPACT_UI)
    const navigate = useNavigate();
    const location = useLocation();

    useWakeLock()

    function itemSelected(event: { target: { value: To; }; }) {
        console.debug(`itemSelected: ${JSON.stringify(event.target.value)}`)
        navigate(event.target.value);
    }

    return (
        <>
            <div id="nav-bar" style={{display: "flex", justifyContent: "space-between", height:"100%"}}>
                <CurrentParticipantTimeWidget style={{visibility: showParticipantTime ? "visible" : "hidden"}}/>
                <div className={"inline-flex"} style={{width: 'fit-content', gap:"0.5em", alignItems:"center", height:"inherit"}} >
                    {compactUi && <DriverSelectorWidget compact={true}/>}<ControlSourceWidget/><SampleSourceWidget/>{compactUi && <PortaCountCommandWidget compact={true}/>}
                </div>
                <select className="narrow-nav-links" onChange={itemSelected} value={location.pathname}>
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
                    | <NavLink to={"/view-results"}>Results</NavLink>
                    | <NavLink to={"/raw-data"}>Raw&nbsp;Data</NavLink>
                    | <NavLink to={"/settings"}>Settings</NavLink>
                    | <NavLink to={"/protocols"}>Protocols</NavLink>
                    | <NavLink to={"/stats"}>Stats</NavLink>
                    | <NavLink to={"/estimate"}>Estimate</NavLink>
                    {<>| <NavLink to={"/qrscanner"}>QR Scanner</NavLink></>}
                </div>
                <EventTimeWidget style={{visibility: showEventTime ? "visible" : "hidden"}}/>
                {/*<NewSettingsNotifier/> this interferes with browser detection redirect, since this also redirects*/}
            </div>
            <BrowserDetect/>
        </>
    )
}
