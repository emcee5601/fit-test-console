import {NavBar} from "./NavBar.tsx";
import {Outlet} from "react-router";
import {AppContextProvider} from "./AppContextProvider.tsx";

export function MainLayout() {
    return (<>
        <AppContextProvider>
            <div style={{position:"fixed", top:0, left: 0, width:"100vw"}}>
                <NavBar/>
            </div>
            <div style={{position:"fixed", top:"2rem", left: 0, right: "0.5rem", width:"calc(100vw - 1rem)", bottom:0, overflow:"auto", marginInline:"0.5rem"}}>
            <Outlet/>
            </div>
        </AppContextProvider>
    </>)
}
