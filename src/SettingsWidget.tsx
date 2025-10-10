import "./SettingsWidget.css"
import {FaGear} from "react-icons/fa6";
import {SettingsPanel} from "src/SettingsPanel.tsx";

export function SettingsWidget() {
    return (
        <div style={{display: "block"}}>
            <input className="settings-toggle-menu" id="settings-menu" type="checkbox"/>
            <label className="settings-button" htmlFor="settings-menu"><FaGear /></label>
            <label className="settings-overlay" htmlFor="settings-menu"></label>
            <div className={"settings-nav"}>
                <SettingsPanel/>
            </div>
        </div>
    )
}
