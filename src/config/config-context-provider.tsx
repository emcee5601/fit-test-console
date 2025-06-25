import {PropsWithChildren} from "react";
import {ConfigContext, defaultConfigManager} from "src/config/config-context.tsx";

export function ConfigContextProvider({children}: PropsWithChildren) {
    return (<ConfigContext.Provider value={defaultConfigManager}>{children}</ConfigContext.Provider>)
}
