import {NavBar} from "./NavBar.tsx";
import {Outlet} from "react-router";
import {AppContextProvider} from "./AppContextProvider.tsx";

export function MainLayout() {
    return (<>
        <AppContextProvider>
            <div id="navbar-container" style={{position: "relative", top: 0, left: 0}}>
                <NavBar/>
            </div>
            <div style={{
                position: "relative",
                top: "0.5rem",
                bottom: "2.4rem",
                left: 0,
                right: "0.5rem",
                width: "calc(100vw - 1.4rem)",
                height: "calc(100% - 2.4rem)",
                overflow: "auto",
                marginInline: "0.5rem"
            }}>
                <Outlet/>
            </div>
        </AppContextProvider>
    </>)
}
