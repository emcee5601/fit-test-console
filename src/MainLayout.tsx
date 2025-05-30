import {NavBar} from "./NavBar.tsx";
import {Outlet} from "react-router";
import {AppContextProvider} from "./AppContextProvider.tsx";

export default function MainLayout() {
    // Since we're now trying to allow multiple versions of this app to be deployed on the same origin, try to identify the "old" versions
    const pathname = window.location.pathname;
    const showRedBorder = pathname.endsWith("old/") || pathname.endsWith("-old")
    return (<>
        <AppContextProvider>
            <div className={`app-border-container ${showRedBorder?"red-border":""}`}>
                <div className={"app-container"} style={{display: "flex", flexDirection: "column"}}>
                    <div id="navbar-container" style={{position: "relative", top: 0, left: 0}}>
                        <NavBar/>
                    </div>
                    <div id="main-container" style={{
                        position: "relative",
                        top: "0.1rem",
                        height: "100%",
                        overflow: "auto",
                        backgroundColor: "white",
                    }}>
                        <Outlet/>
                    </div>
                </div>
            </div>
        </AppContextProvider>
    </>)
}
