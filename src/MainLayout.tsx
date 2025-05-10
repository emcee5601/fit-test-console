import {NavBar} from "./NavBar.tsx";
import {Outlet} from "react-router";
import {AppContextProvider} from "./AppContextProvider.tsx";

export default function MainLayout() {
    return (<>
        <AppContextProvider>
            <div className={"app-container"} style={{display:"flex", flexDirection:"column"}}>
                <div id="navbar-container" style={{position: "relative", top: 0, left: 0}}>
                    <NavBar/>
                </div>
                <div id="main-container" style={{
                    position: "relative",
                    top: "0.1rem",
                    height: "100%",
                    overflow: "auto",
                }}>
                    <Outlet/>
                </div>
            </div>
        </AppContextProvider>
    </>)
}
