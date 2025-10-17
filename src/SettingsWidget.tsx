import {FaGear} from "react-icons/fa6";
import {OverlayPanelWidget} from "src/OverlayPanelWidget.tsx";
import {SettingsPanel} from "src/SettingsPanel.tsx";

export function SettingsWidget() {
    return (
        <OverlayPanelWidget buttonIcon={<FaGear className={"nav-icon"}/>} position={"right"}>
            <SettingsPanel/>
        </OverlayPanelWidget>
    )
}
