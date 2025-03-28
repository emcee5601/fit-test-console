import {NavLink, useNavigate} from "react-router";
import {useWakeLock} from "./use-wake-lock.ts";
import {useEffect} from "react";

export function NavBar() {
    const navigate = useNavigate();
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
        <div style={{display: "block"}}>
            <NavLink to={"/"}>Home</NavLink>
            | <NavLink to={"/estimate"}>Estimate</NavLink>
            | <NavLink to={"/view-results"}>Results</NavLink>
            | <NavLink to={"/settings"}>Settings</NavLink>
            | <NavLink to={"/protocols"}>Protocols</NavLink>
            | <NavLink to={"/raw-data"}>Raw data</NavLink>
        </div>
    )
}
