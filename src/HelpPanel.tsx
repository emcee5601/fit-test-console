export function HelpPanel() {
    return (<div style={{textAlign: "start"}}>
        <ul>
            <li> Test panel</li>
            <ul>
                <li>Tap participant info banner to edit participant info.</li>
                <li>Tap exercise score to restart from that exercise. Only available when paused.</li>
                <li>Tap leaf/mask icon in FF preview box to reset ambient/mask values used for preview. This triggers an automatic purge interval.</li>
                <li>The instructions slider adjusts instructions font size.</li>
                <li>Blue progress bars denote progress within each stage/exercise and protocol.</li>
            </ul>

        </ul>
    </div>)
}
