import {NavLink, useLocation, useNavigate} from "react-router";
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
import {ActionMenuWidget, SelectOption} from "src/ActionMenuWidget.tsx";
import {IoMdArrowDropdown} from "react-icons/io";
import {CurrentActivityWidget} from "src/CurrentActivityWidget.tsx";
import {PortaCountLastLineWidget} from "src/PortaCountLastLineWidget.tsx";
import {ReactNode} from "react";


export function NavBar() {
    const [showParticipantTime] = useSetting<boolean>(AppSettings.SHOW_ELAPSED_PARTICIPANT_TIME)
    const [showEventTime] = useSetting<boolean>(AppSettings.SHOW_REMAINING_EVENT_TIME)
    const [compactUi] = useSetting<boolean>(AppSettings.USE_COMPACT_UI)
    const [enableProtocolEditor] = useSetting<boolean>(AppSettings.ENABLE_PROTOCOL_EDITOR)
    const [enableStats] = useSetting<boolean>(AppSettings.ENABLE_STATS);
    const [enableQrCodeScanner] = useSetting<boolean>(AppSettings.ENABLE_QR_CODE_SCANNER)
    const navigate = useNavigate();
    const location = useLocation();

    useWakeLock()

    const navLinks: SelectOption[] = [
        {
            label: "Home",
            value: "/"
        },
        {
            label: "Results",
            value: "/view-results"
        },
        {
            label: "Raw Data",
            value: "/raw-data"
        },
        {
            label: "Settings",
            value: "/settings"
        },
    ];
    if (enableProtocolEditor) {
        navLinks.push(
            {
                label: "Protocols",
                value:
                    "/protocols"
            }
        )
    }
    if (enableStats) {
        navLinks.push(
            {
                label: "Stats",
                value:
                    "/stats"
            }
        )
    }
    if (enableQrCodeScanner) {
        navLinks.push({
                label: "QR Code",
                value:
                    "/qrscanner"
            }
        )
    }
    return (
        <>
            <div id="nav-bar" style={{display: "flex", justifyContent: "space-between", height: "100%"}}>
                <CurrentParticipantTimeWidget style={{visibility: showParticipantTime ? "visible" : "hidden"}}/>
                <div id={"nav-links-container"} className={"inline-flex"}
                     style={{gap: "0.3em", flexWrap: "wrap", justifyContent: "center"}}>
                    <div>v{__APP_VERSION__}{import.meta.env.MODE[0]}</div>
                    <div className={"narrow-nav-links"}>
                        <ActionMenuWidget
                            options={navLinks}
                            value={location.pathname}
                            onChange={(destination) => navigate(destination)}>
                            <div
                                className={"blue-bg thin-border svg-container inline-flex no-wrap"}>{navLinks.find((value) => value.value === location.pathname)?.label}<IoMdArrowDropdown/>
                            </div>
                        </ActionMenuWidget>
                    </div>
                    <div className="wide-nav-links flex-wrap" style={{gap: "0.1em"}}>
                        {navLinks.reduce((result: ReactNode[], option) => {
                            if (result.length > 0) {
                                result.push("|")
                            }
                            result.push(<NavLink key={option.label} to={option.value} className={({
                                isActive,
                                isPending
                            }) => isPending ? "nav-link-pending" : isActive ? "nav-link-active" : ""}>
                                <div className={"no-wrap"}>{option.label}</div>
                            </NavLink>)
                            return result;
                        }, [])}
                    </div>
                    <div id="compact-ui" className={"inline-flex"}
                         style={{width: 'fit-content', gap: "0.3em", alignItems: "center", height: "inherit", flexWrap: "wrap", justifyContent: "center"}}>
                        {compactUi && <DriverSelectorWidget compact={true}/>}
                        <ControlSourceWidget/>
                        <SampleSourceWidget/>
                        {compactUi && <PortaCountCommandWidget compact={true}/>}
                        {compactUi && <CurrentActivityWidget label={""}/>}
                        {compactUi && <PortaCountLastLineWidget label={""}/>}
                    </div>
                </div>
                <EventTimeWidget style={{visibility: showEventTime ? "visible" : "hidden"}}/>
                {/*<NewSettingsNotifier/> this interferes with browser detection redirect, since this also redirects*/}
            </div>
            <BrowserDetect/>
        </>
    )
}
