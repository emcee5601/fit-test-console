import {useEffect, useRef, useState} from "react";
import {Location, NavigateFunction, NavLink, useLocation, useNavigate} from "react-router";
import {SelectOption} from "src/ActionMenuWidget.tsx";
import {AppSettings} from "src/app-settings-types.ts";
import {ColorSchemeSwitcher} from "src/ColorSchemeSwitcher.tsx";
import {CurrentParticipantTimeWidget} from "src/CurrentParticipantTimeWidget.tsx";
import {EventTimeWidget} from "src/EventTimeWidget.tsx";
import {MenuWidget} from "src/MenuWidget.tsx";
import {SettingsWidget} from "src/SettingsWidget.tsx";
import {useSetting} from "src/use-setting.ts";
import {isMobile} from "src/utils.ts";
import {useWakeLock} from "./use-wake-lock.ts";


type NavBarState = "full-width" | "time-icons" | "2-lines" | "dropdown-tabs"

const _touchEvents = ["touchstart", "touchend", "touchcancel", "touchmove"] as const;
type TouchEventType = typeof _touchEvents[number];

type Point = { x: number, y: number };

class TouchListener implements EventListenerObject {
    private touchStartPoint: Point | null;
    private readonly links: SelectOption[];
    private readonly location: Location;
    private readonly navigate: NavigateFunction;

    constructor(links: SelectOption[], location: Location, navigate: NavigateFunction) {
        this.touchStartPoint = null;
        this.links = links;
        this.location = location;
        this.navigate = navigate;
    }

    handleEvent(event: TouchEvent) {
        const touchEvent = event
        const minDragDistancePercentage = 50;
        const minDragDistance = window.outerWidth * minDragDistancePercentage / 100.0;
        const maxDistanceFromEdge = 10;
        switch (touchEvent.type) {
            case "touchstart": {
                // console.log("touch start", touchEvent, "width:", window.innerWidth, " outerwidth:",
                // window.outerWidth)
                const item = touchEvent.targetTouches.item(0);
                if (item) {
                    if (item.clientX < maxDistanceFromEdge || item.clientX > window.outerWidth - maxDistanceFromEdge) {
                        // we only want edge swipes
                        this.touchStartPoint = {x: item.clientX, y: item.clientY}
                    } else {
                        this.touchStartPoint = null; // ignore touch start too far from edge
                    }
                }
                break;
            }
            case "touchend": {
                // console.log("touch end", touchEvent)
                if (!this.touchStartPoint) {
                    return
                }
                const item = touchEvent.changedTouches.item(0);
                if (!item) {
                    return
                }
                const endPoint: Point = {x: item.clientX, y: item.clientY}

                const currentPath = this.location.pathname;
                const index = this.links.findIndex((value) => value.value === currentPath);
                // console.debug("current path is", currentPath)

                if (endPoint.x > this.touchStartPoint.x + minDragDistance) {
                    console.debug("swiped right ->")
                    if (index > -1) {
                        this.navigate(this.links[(this.links.length + index - 1) % this.links.length].value)
                    }
                }
                if (endPoint.x < this.touchStartPoint.x - minDragDistance) {
                    console.debug("swiped left <-")
                    if (index > -1) {
                        this.navigate(this.links[(index + 1) % this.links.length].value)
                    }
                }
                if (endPoint.y > this.touchStartPoint.y + minDragDistance) {
                    console.debug("swiped down V")
                }
                if (endPoint.y < this.touchStartPoint.y - minDragDistance) {
                    console.debug("swiped up ^")
                }
                break;
            }
            case "touchmove":
                break;
            case "touchcancel":
                break;
        }
    }
}

export function NavBar() {
    const [showParticipantTime] = useSetting<boolean>(AppSettings.SHOW_ELAPSED_PARTICIPANT_TIME)
    const [showEventTime] = useSetting<boolean>(AppSettings.SHOW_REMAINING_EVENT_TIME)
    const [enableTesterMode] = useSetting<boolean>(AppSettings.ENABLE_TESTER_MODE)
    const navigate = useNavigate();
    const location: Location = useLocation();
    const ref = useRef<HTMLDivElement>(null)
    const [navBarState, setNavBarState] = useState<NavBarState>("full-width");
    const [prevWidth, setPrevWidth] = useState<number>(0)
    const [useIcons, setUseIcons] = useState<boolean>(false)

    useEffect(() => {
        const touchListener = new TouchListener(navLinks, location, navigate)

        const touchEvents: TouchEventType[] = [..._touchEvents]
        touchEvents.forEach((event) => window.addEventListener(event, touchListener));
        return () => {
            touchEvents.forEach((event) => window.removeEventListener(event, touchListener));
        }
    }, [location]);

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
        return () => {
            screen.orientation.removeEventListener("change", listener);
        }
    }, []);

    useWakeLock()

    const navLinks: SelectOption[] =
        enableTesterMode
            ? [
                {
                    label: "Test",
                    value: "/test",
                },
                {
                    label: "Participant",
                    value: "/participant"
                },
                {
                    label: "All Results",
                    value: "/view-results"
                },
                {
                    label: "Daily Checks",
                    value: "/daily-checks"
                },
                {
                    label: "Bookmarks",
                    value: "/bookmarks"
                },
                {
                    label: "Protocols",
                    value: "/protocols"
                },
                {
                    label: "Stats",
                    value: "/stats"
                },
                {
                    label: "QR Code",
                    value: "/qrscanner"
                },
                {
                    label: "Raw Data",
                    value: "/raw-data"
                },
                {
                    label: "Help",
                    value: "/help"
                },
            ]
            : [ // participant mode
                {
                    label: "Results",
                    value: "/view-results"
                },
                {
                    label: "Bookmarks",
                    value: "/bookmarks"
                }
            ]


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
                if (isMobile()) {
                    console.debug("mobile mode")
                    setUseIcons(true)
                    break;
                }
                // should have 1 line
                if (numLines > 1) {
                    // width narrowed
                    setNavBarState("2-lines")
                }
                setUseIcons(false)
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
                break;
            case "dropdown-tabs":
                if (numLines < 2 && isWidening) {
                    // we can fit everything onto 1 line and we're widening the screen, try to step down
                    setNavBarState("time-icons")
                }
                setUseIcons(true)
                break;
            default:
                // ignore
                break;
        }
        // console.debug(`navBarState: ${navBarState}, prevWidth: ${prevWidth}, new width: ${computedStyle.width},
        // isWidening? ${isWidening}, numLines: ${numLines}`)
        setPrevWidth(parseFloat(computedStyle.width))
    }

    return (
        <div id="nav-bar"
             ref={ref}
             className={"nav-bar"}>
            <ColorSchemeSwitcher/>
            <MenuWidget options={navLinks}/>
            <CurrentParticipantTimeWidget style={{display: showParticipantTime && enableTesterMode ? "inline-flex" : "none"}}
                                          useIcons={useIcons}/>

            {navLinks.map((option: SelectOption) =>
                    <NavLink key={option.label} to={option.value} className={({
                        isActive
                    }) => isActive ? "nav-link-active" : "nav-link-hidden"}
                    >
                        <div className={"no-wrap"}>{option.label}</div>
                    </NavLink>

                )}

            <EventTimeWidget style={{display: showEventTime && enableTesterMode ? "inline-flex" : "none"}} useIcons={useIcons}/>
            <SettingsWidget/>
        </div>
    )
}
