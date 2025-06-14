import {NavLink, useLocation, useNavigate} from "react-router";
import {useWakeLock} from "./use-wake-lock.ts";
import {EventTimeWidget} from "src/EventTimeWidget.tsx";
import {CurrentParticipantTimeWidget} from "src/CurrentParticipantTimeWidget.tsx";
import {useSetting} from "src/use-setting.ts";
import {AppSettings} from "src/app-settings.ts";
import {SampleSourceWidget} from "src/SampleSourceWidget.tsx";
import {ControlSourceWidget} from "src/ControlSourceWidget.tsx";
import {PortaCountCommandWidget} from "src/PortaCountCommandWidget.tsx";
import {DriverSelectorWidget} from "src/DriverSelectorWidget.tsx";
import {ActionMenuWidget, SelectOption} from "src/ActionMenuWidget.tsx";
import {IoMdArrowDropdown} from "react-icons/io";
import {CurrentActivityWidget} from "src/CurrentActivityWidget.tsx";
import {PortaCountLastLineWidget} from "src/PortaCountLastLineWidget.tsx";
import {ReactNode, useEffect, useRef, useState} from "react";
import {ColorSchemeSwitcher} from "src/ColorSchemeSwitcher.tsx";


type NavBarState = "full-width" | "time-icons" | "2-lines" | "dropdown-tabs"

export function NavBar() {
    const [showParticipantTime] = useSetting<boolean>(AppSettings.SHOW_ELAPSED_PARTICIPANT_TIME)
    const [showEventTime] = useSetting<boolean>(AppSettings.SHOW_REMAINING_EVENT_TIME)
    const [compactUi] = useSetting<boolean>(AppSettings.USE_COMPACT_UI)
    const [enableProtocolEditor] = useSetting<boolean>(AppSettings.ENABLE_PROTOCOL_EDITOR)
    const [enableStats] = useSetting<boolean>(AppSettings.ENABLE_STATS);
    const [enableQrCodeScanner] = useSetting<boolean>(AppSettings.ENABLE_QR_CODE_SCANNER)
    const navigate = useNavigate();
    const location = useLocation();
    const ref = useRef<HTMLDivElement>(null)
    const [navBarState, setNavBarState] = useState<NavBarState>("full-width");
    const [prevWidth, setPrevWidth] = useState<number>(0)
    const [useIcons, setUseIcons] = useState<boolean>(false)
    const [useDropdownTabs, setUseDropdownTabs] = useState<boolean>(false)

    useEffect(() => {
        const resizeObserver = new ResizeObserver(([entry]) => {
            // assume it's just the one element we're observing
            resizeAsNecessary(entry)
        })
        if (ref.current) {
            resizeObserver.observe(ref.current)
        }

        return () => {
            resizeObserver.disconnect()
        };
    }, [navBarState]);

    useEffect(() => {
        // reset nav bar state when orientation changes.
        // on mobile, we don't get resize events so need to re-calculate from the start.
        const listener = () => setNavBarState("full-width")
        screen.orientation.addEventListener("change", listener);
        return () => {screen.orientation.removeEventListener("change", listener);}
    }, []);

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
                value: "/protocols"
            }
        )
    }
    if (enableStats) {
        navLinks.push(
            {
                label: "Stats",
                value: "/stats"
            }
        )
    }
    if (enableQrCodeScanner) {
        navLinks.push({
                label: "QR Code",
                value: "/qrscanner"
            }
        )
    }
    navLinks.push({
        label: "Daily Checks",
        value: "/daily-checks"
    })
    navLinks.push({
        label: "Bookmarks",
        value: "/bookmarks"
    })


    function resizeAsNecessary(entry: ResizeObserverEntry) {
        const computedStyle = window.getComputedStyle(entry.target)
        // ignore the units. they should be in px?
        const numLines = Math.floor(parseFloat(computedStyle.height) / parseFloat(computedStyle.lineHeight))
        const isWidening = parseFloat(computedStyle.width) - prevWidth > 0;
        /**
         * stages
         * - 1 line: full width
         * - 2 lines
         * - 2 line: timing widgets use icons
         * - 2 lines: dropdown tabs
         */
        switch (navBarState) {
            case "full-width":
                // should have 1 line
                if (numLines > 1) {
                    // width narrowed
                    setNavBarState("2-lines")
                }
                setUseIcons(false)
                setUseDropdownTabs(false)
                break;
            case "2-lines":
                // should have 2 lines
                if (numLines < 2 && isWidening) {
                    setNavBarState("full-width")
                }
                if (numLines > 2) {
                    setNavBarState("time-icons")
                }
                setUseIcons(false)
                setUseDropdownTabs(false)
                break;
            case "time-icons":
                // probably can merge this into dropdown-tabs state
                if (numLines < 2 && isWidening) {
                    setNavBarState("2-lines")
                }
                if (numLines > 2) {
                    setNavBarState("dropdown-tabs")
                }
                setUseIcons(true)
                setUseDropdownTabs(false)
                break;
            case "dropdown-tabs":
                if (numLines < 2 && isWidening) {
                    // we can fit everything onto 1 line and we're widening the screen, try to step down
                    setNavBarState("time-icons")
                }
                setUseIcons(true)
                setUseDropdownTabs(true)
                break;
            default:
                // ignore
                break;
        }
        // console.debug(`navBarState: ${navBarState}, prevWidth: ${prevWidth}, new width: ${computedStyle.width}, isWidening? ${isWidening}, numLines: ${numLines}`)
        setPrevWidth(parseFloat(computedStyle.width))
    }

    return (
        <div id="nav-bar"
             ref={ref}
             style={{display: "flex", justifyContent: "space-between", height: "100%"}}>
            <ColorSchemeSwitcher/>
            <CurrentParticipantTimeWidget style={{visibility: showParticipantTime ? "visible" : "hidden"}}
                                          useIcons={useIcons}/>
            <div id={"nav-links-container"} className={"inline-flex"}
                 style={{gap: "0.3em", flexWrap: "wrap", justifyContent: "center"}}>
                <div>v{__APP_VERSION__}{import.meta.env.MODE[0]}</div>
                {useDropdownTabs
                    ? <div>
                        <ActionMenuWidget
                            options={navLinks}
                            value={location.pathname}
                            onChange={(destination) => navigate(destination)}>
                            <div
                                className={"blue-bg thin-border svg-container inline-flex no-wrap"}>{navLinks.find((value) => value.value === location.pathname)?.label}<IoMdArrowDropdown/>
                            </div>
                        </ActionMenuWidget>
                    </div>
                    : <div style={{gap: "0.1em", display:"flex", flexWrap:"wrap"}}>
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
                }
                <div id="compact-ui" className={"inline-flex"}
                     style={{
                         width: 'fit-content',
                         gap: "0.3em",
                         alignItems: "center",
                         height: "inherit",
                         flexWrap: "wrap",
                         justifyContent: "center"
                     }}>
                    {compactUi && <DriverSelectorWidget compact={true}/>}
                    <ControlSourceWidget/>
                    <SampleSourceWidget/>
                    {compactUi && <PortaCountCommandWidget compact={true}/>}
                    {compactUi && <CurrentActivityWidget label={""}/>}
                    {compactUi && <PortaCountLastLineWidget label={""}/>}
                </div>
            </div>
            <EventTimeWidget style={{visibility: showEventTime ? "visible" : "hidden"}} useIcons={useIcons}/>
            {/*<NewSettingsNotifier/> this interferes with browser detection redirect, since this also redirects*/}
        </div>
    )
}
