import {NavLink, useNavigate} from "react-router";
import {useWakeLock} from "./use-wake-lock.ts";
import {useEffect} from "react";
import {EventTimeWidget} from "src/EventTimeWidget.tsx";
import {CurrentParticipantTimeWidget} from "src/CurrentParticipantTimeWidget.tsx";
import {useSetting} from "src/use-setting.ts";
import {AppSettings} from "src/app-settings.ts";
import {BrowserDetect} from "src/BrowserDetect.tsx";

export function NavBar() {
    const navigate = useNavigate();
    const [showParticipantTime] = useSetting<boolean>(AppSettings.SHOW_ELAPSED_PARTICIPANT_TIME)
    const [showEventTime] = useSetting<boolean>(AppSettings.SHOW_REMAINING_EVENT_TIME)

    useEffect(() => {
        // capture escape key to dismiss the panel
        const keyListener = (keyEvent: KeyboardEvent) => {
            if (keyEvent.code === "Escape") {
                goHome()
            }
        };
        window.addEventListener("keydown", keyListener)
        return () => {
            window.removeEventListener("keypress", keyListener)
        }
    }, []);

    function goHome() {
        navigate("/")
    }

    useWakeLock()
    return (
        <>
            <div style={{display: "flex", justifyContent: "space-between"}}>
                <CurrentParticipantTimeWidget style={{visibility: showParticipantTime ? "visible" : "hidden"}}/>
                <div>
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
