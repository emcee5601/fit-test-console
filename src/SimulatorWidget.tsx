import {FaRobot} from "react-icons/fa";
import {AppSettings} from "src/app-settings-types.ts";
import {OverlayPanelWidget} from "src/OverlayPanelWidget.tsx";
import {useSetting} from "src/use-setting.ts";

export function SimulatorWidget() {
    const [enableSimulator] = useSetting<boolean>(AppSettings.ENABLE_SIMULATOR)
    const [enableTesterMode] = useSetting<boolean>(AppSettings.ENABLE_TESTER_MODE)
    const simulatorWidgetEnabled = enableSimulator && enableTesterMode;

    return (
        <>
            {simulatorWidgetEnabled &&
                <OverlayPanelWidget position={["top", "right"]} buttonIcon={<FaRobot className={"nav-icon"}/>}>
                    Simulator controls go here
                </OverlayPanelWidget>
            }
        </>
    )
}
