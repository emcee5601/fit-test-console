import {createContext} from "react";
import {ConfigManager} from "src/config/config-manager.ts";

export const defaultConfigManager = new ConfigManager("so-");
export const ConfigContext = createContext(defaultConfigManager);
