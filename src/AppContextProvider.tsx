import {PropsWithChildren} from "react";
import {APP_CONTEXT, AppContext} from "./app-context.ts";

export function AppContextProvider({children}: PropsWithChildren) {
    return (<AppContext.Provider value={APP_CONTEXT}>{children}</AppContext.Provider>)
}
