import {SettingsSelect} from "./Settings.tsx";
import {EnableSpeechSwitch} from "./speech-voice-selector.tsx";
import {ChangeEvent, useCallback, useContext, useEffect, useState} from "react";
import {downloadData} from "./download-helper.ts";
import {RESULTS_DB} from "./SimpleResultsDB.ts";
import {RAW_DB} from "./database.ts";
import {AppSettings} from "./app-settings.ts";
import {BooleanSettingToggleButton, BooleanToggleButton} from "./ToggleButton.tsx";
import {useSetting} from "./use-setting.ts";
import {SpeechVoiceSelectorWidget} from "./SpeechVoiceSelectorWidget.tsx";
import {DebouncedInput} from "./DebouncedInput.tsx";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {AppContext} from "src/app-context.ts";
import {InfoBox} from "src/InfoBox.tsx";
import {ExternalController} from "src/external-control.ts";
import {formatDuration} from "src/utils.ts";
import {PortaCountListener} from "src/portacount-client-8020.ts";
import {SmartTextArea} from "src/SmartTextArea.tsx";

export function SettingsPanel() {
    const appContext = useContext(AppContext)
    const portaCountState = appContext.portaCountClient.state;
    const portaCountSettings = appContext.portaCountClient.settings
    const [baudRate, setBaudRate] = useSetting<number>(AppSettings.BAUD_RATE)
    const [showAdvancedControls] = useSetting<boolean>(AppSettings.ADVANCED_MODE);
    const [showRemainingEventTime] = useSetting<boolean>(AppSettings.SHOW_REMAINING_EVENT_TIME)
    const [showElapsedParticipantTime] = useSetting<boolean>(AppSettings.SHOW_ELAPSED_PARTICIPANT_TIME)
    const [showDangerZoneSettings, setShowDangerZoneSettings] = useState<boolean>(false); // don't persist this setting
    const [dataToDownload, setDataToDownload] = useState<string>("all-raw-data")
    const [minutesPerParticipant, setMinutesPerParticipant] = useSetting<number>(AppSettings.MINUTES_ALLOTTED_PER_PARTICIPANT)
    const [maskList, setMaskList] = useSetting<string[]>(AppSettings.MASK_LIST)
    const [colorScheme, setColorScheme] = useSetting<string>(AppSettings.COLOR_SCHEME)
    const [eventEndDate, setEventEndDate] = useState<Date>(appContext.settings.eventEndTime)

    const [, helpUpdateState] = useState({})
    const updateState = useCallback(() => {
        helpUpdateState({})
    }, []);

    function downloadFileFormatChanged(event: ChangeEvent<HTMLSelectElement>) {
        setDataToDownload(event.target.value);
    }

    function downloadButtonClickHandler() {
        switch (dataToDownload) {
            case "all-raw-data":
                downloadAllRawDataAsJSON()
                break;
            case "all-results-as-json":
                downloadAllResultsAsJSON();
                break;
            default:
                console.log(`unsupported data to download: ${dataToDownload}`);
        }
    }

    async function downloadAllRawDataAsJSON() {
        // grab all data from the database and download it
        await RAW_DB.getData().then(data => {
            downloadData(JSON.stringify(data), "fit-test-all-raw-data", "json");
        })
    }

    function downloadAllResultsAsJSON() {
        RESULTS_DB.getData().then(data => {
            downloadData(JSON.stringify(data), "fit-test-all-results", "json");
        })
    }

    function handleMinutesPerParticipantChanged(value: number | string) {
        // the input type=number doesn't prevent manually entering out-of-range numbers
        const numberValue = Number(value);
        if (isNaN(numberValue)) {
            // do nothing (invalid input)
            setMinutesPerParticipant((prev) => prev)
        } else if (numberValue > 0) {
            setMinutesPerParticipant(numberValue);
        } else {
            // ignore, out of range number
            console.warn(`ignoring out-of-range minutes per participant value: ${value}`)
        }
    }

    useEffect(() => {
        appContext.settings.eventEndTime = eventEndDate
    }, [eventEndDate]);

    useEffect(() => {
        // on the initial load, the settings db isn't always loaded. Wait until it's loaded to populate the setting
        // value so it doesn't incorrectly display the default. This happens because .eventEndTime is calculated
        appContext.settings.getActualSetting(AppSettings.EVENT_END_HHMM).then(() => {
            setEventEndDate(appContext.settings.eventEndTime);
        })

        const portaCountListener: PortaCountListener = {
            stateChanged() {
                updateState()
            },
            settingsChanged() {
                updateState()
            }
        }
        appContext.portaCountClient.addListener(portaCountListener);
        return () => {
            appContext.portaCountClient.removeListener(portaCountListener);
        };
    }, []);


    function fetchSettingsAndStateInfo() {
        const externalController = appContext.portaCountClient.externalController;
        externalController.assumeManualControl()
        externalController.requestRuntimeStatus()
        externalController.sendCommand(ExternalController.REQUEST_VOLTAGE_INFO)
        externalController.requestSettings()
    }

    return (
        <div id="settings-panel">
            <fieldset>
                {`mftc v${__APP_VERSION__} ${import.meta.env.MODE}`}
            </fieldset>
            <fieldset>
                <legend>Settings</legend>
                <section id="settings" style={{
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "wrap",
                    justifyContent: "center",
                    alignItems: "stretch",
                }}>
                    <section id={"basic-controls"}>
                        <fieldset>
                            <legend>Basic</legend>
                            <BooleanSettingToggleButton
                                setting={AppSettings.KEEP_SCREEN_AWAKE}/>
                            <EnableSpeechSwitch/>
                            <BooleanSettingToggleButton
                                setting={AppSettings.SAY_PARTICLE_COUNT}/>
                            <BooleanSettingToggleButton
                                setting={AppSettings.SAY_ESTIMATED_FIT_FACTOR}/>
                            <div className={"labeled-setting"}>
                                <select id="download-file-format-selector" defaultValue={dataToDownload}
                                        onChange={downloadFileFormatChanged}>
                                    <option value="all-raw-data">All Raw data as JSON</option>
                                    <option value="all-results-as-json">All results as JSON</option>
                                </select>
                                <input className="button" type="button" value="Download!" id="download-button"
                                       onClick={downloadButtonClickHandler}/>
                            </div>
                        </fieldset>
                    </section>
                    <section id={"event settings"}>
                        <fieldset>
                            <legend>Event settings</legend>
                            <BooleanSettingToggleButton setting={AppSettings.SHOW_ELAPSED_PARTICIPANT_TIME}/>
                            {showElapsedParticipantTime && <div className={"labeled-setting"}>
                                <label htmlFor={"minutes-per-participant-input"}>Minutes per participant:</label>
                                <DebouncedInput style={{width: "8ch"}} id={"minutes-per-participant-input"}
                                                value={minutesPerParticipant}
                                                onChange={handleMinutesPerParticipantChanged}
                                                type="number" min={1} max={60}
                                />
                            </div>}
                            <BooleanSettingToggleButton setting={AppSettings.SHOW_REMAINING_EVENT_TIME}/>
                            {showRemainingEventTime && <div className={"labeled-setting"}>
                                <label>Event end time</label>
                                <DatePicker className={"date-time-input"} selected={eventEndDate}
                                            showTimeSelect
                                            showTimeCaption={true}
                                            includeDates={[new Date()]}
                                            showIcon={true}
                                            dateFormat={"YYYY-MMM-dd HH:mm"}
                                            timeFormat={"HH:mm"}
                                            placeholderText={"Pick end time"}
                                            onChange={(date) => date && setEventEndDate(date)}
                                ></DatePicker>
                            </div>}
                        </fieldset>
                    </section>
                    <section id={"advanced-controls"}>
                        <fieldset>
                            <legend><BooleanSettingToggleButton trueLabel={"Advanced settings"}
                                                                setting={AppSettings.ADVANCED_MODE}/>
                            </legend>
                            <div style={{display: showAdvancedControls ? "inline-block" : "none"}}>
                                <SettingsSelect label={"Baud Rate"} value={baudRate.toString()}
                                                setValue={(value) => setBaudRate(Number(value))}
                                    // todo: make these values numbers
                                                options={[
                                                    {"300": "300"},
                                                    {"600": "600"},
                                                    {"1200": "1200"},
                                                    {"2400": "2400"},
                                                    {"9600": "9600"}
                                                ]}/>
                                <SettingsSelect label={"Color Scheme"} value={colorScheme}
                                                setValue={(value) => setColorScheme(value)}
                                                options={[
                                                    {"Auto": "light dark"},
                                                    {"Dark": "dark"},
                                                    {"Light": "light"},
                                                ]}/>
                                <SpeechVoiceSelectorWidget/>
                                <BooleanSettingToggleButton trueLabel={"Verbose speech"} setting={AppSettings.VERBOSE}/>
                                <BooleanSettingToggleButton
                                    setting={AppSettings.SHOW_EXTERNAL_CONTROL}/>
                                <BooleanSettingToggleButton setting={AppSettings.ENABLE_TEST_INSTRUCTIONS_ZOOM}/>
                                <BooleanSettingToggleButton setting={AppSettings.USE_COMPACT_UI}/>
                                <BooleanSettingToggleButton setting={AppSettings.ENABLE_WEB_SERIAL_DRIVERS}/>
                                <BooleanSettingToggleButton setting={AppSettings.ENABLE_PROTOCOL_EDITOR}/>
                                <BooleanSettingToggleButton setting={AppSettings.ENABLE_QR_CODE_SCANNER}/>
                                <BooleanSettingToggleButton setting={AppSettings.ENABLE_STATS}/>
                                <BooleanSettingToggleButton setting={AppSettings.AUTO_UPDATE_MASK_LIST}/>
                                <BooleanSettingToggleButton
                                    setting={AppSettings.ENABLE_AUTO_CONNECT}/>
                                <BooleanSettingToggleButton
                                    setting={AppSettings.SYNC_DEVICE_STATE_ON_CONNECT}/>
                                <BooleanSettingToggleButton setting={AppSettings.AUTO_CREATE_FAST_PROTOCOLS}/>
                                <BooleanSettingToggleButton
                                    setting={AppSettings.ENABLE_SIMULATOR}/>
                                <BooleanToggleButton trueLabel={"Show Danger Zone"} value={showDangerZoneSettings}
                                                     setValue={setShowDangerZoneSettings}/>
                            </div>
                        </fieldset>
                        {showDangerZoneSettings && <fieldset>
                            <legend>Danger Zone</legend>
                            <input type={"button"} value={"Clear Local Storage"}
                                   onClick={() => localStorage.clear()}/>
                        </fieldset>}
                    </section>
                    <fieldset id={"mask-list"}>
                        <legend>Mask list</legend>
                        <div style={{height: "50vh"}}>
                            <SmartTextArea
                                scrollable={true}
                                onChangeOnlyOnBlur={true}
                                initialValue={maskList.join("\n")}
                                onChange={(value) => {
                                    if (value !== undefined) {
                                        setMaskList(value.split(/\n/).map((line) => line.trim()).filter((line) => line.length > 0));
                                    }
                                }}/>
                        </div>
                    </fieldset>
                    <fieldset id={"settings-state"}>
                        <legend>Settings & State</legend>
                        <button onClick={fetchSettingsAndStateInfo}>Fetch settings & state info</button>
                        <InfoBox label={"Serial Number"}>{portaCountSettings.serialNumber}</InfoBox>
                        <InfoBox
                            label={"Last Service Date"}>{portaCountSettings.lastServiceDate.toISOString()}</InfoBox>
                        <InfoBox
                            label={"Run Time Since Service"}>{formatDuration(1000 * portaCountSettings.runTimeSinceFactoryServiceSeconds)}</InfoBox>
                        <InfoBox label={"Num Exercises"}>{portaCountSettings.numExercises}</InfoBox>
                        <InfoBox
                            label={"Ambient Purge"}>{formatDuration(1000 * portaCountSettings.ambientPurge)}</InfoBox>
                        <InfoBox
                            label={"Ambient Sample"}>{formatDuration(1000 * portaCountSettings.ambientSample)}</InfoBox>
                        <InfoBox label={"Mask Purge"}>{formatDuration(1000 * portaCountSettings.maskPurge)}</InfoBox>
                        {/*mask sample*/}
                        {
                            [...portaCountSettings.maskSample.entries()].map(([index, value]) => <InfoBox key={index}
                                                                                                          label={`Ex ${String(index)} sample`}>{formatDuration(1000 * value)}</InfoBox>)
                        }

                        {/*ff pass levels*/}
                        {
                            [...portaCountSettings.fitFactorPassLevel.entries()].map(([index, value]) => <InfoBox
                                key={index} label={`FF pass level ${String(index)}`}>{value}</InfoBox>)
                        }

                        <InfoBox label={"Battery"}>{portaCountState.batteryStatus}</InfoBox>
                        <InfoBox label={"Pulse"}>{portaCountState.pulseStatus}</InfoBox>
                        {
                            [...portaCountState.componentVoltages.entries()].map(([component, value]) => <InfoBox
                                key={component} label={`${component} voltage`}>{value}</InfoBox>)
                        }
                    </fieldset>
                </section>
            </fieldset>
        </div>)
}
