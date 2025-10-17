import {ChangeEvent, useCallback, useContext, useEffect, useState} from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {FaRadiation} from "react-icons/fa";
import {PiWarningOctagonBold} from "react-icons/pi";
import {AppContext} from "src/app-context.ts";
import {AppSettings} from "src/app-settings-types.ts";
import {DriverSelectorWidget} from "src/DriverSelectorWidget.tsx";
import {ExternalController} from "src/external-control.ts";
import {InfoBox} from "src/InfoBox.tsx";
import {PortaCountListener} from "src/portacount-client-8020.ts";
import {ConnectionStatus} from "src/portacount/porta-count-state.ts";
import {SmartTextArea} from "src/SmartTextArea.tsx";
import {formatDuration} from "src/utils.ts";
import {RAW_DB} from "./database.ts";
import {DebouncedInput} from "./DebouncedInput.tsx";
import {downloadData} from "./download-helper.ts";
import {SettingsSelect} from "./Settings.tsx";
import {RESULTS_DB} from "./SimpleResultsDB.ts";
import {EnableSpeechSwitch} from "./speech-voice-selector.tsx";
import {SpeechVoiceSelectorWidget} from "./SpeechVoiceSelectorWidget.tsx";
import {BooleanSettingToggleButton, BooleanToggleButton} from "./ToggleButton.tsx";
import {useSetting} from "./use-setting.ts";

export function SettingsPanel() {
    const appContext = useContext(AppContext)
    const portaCountState = appContext.portaCountClient.state;
    const portaCountSettings = appContext.portaCountClient.settings
    const [baudRate, setBaudRate] = useSetting<number>(AppSettings.BAUD_RATE)
    const [showDangerZoneSettings, setShowDangerZoneSettings] = useState<boolean>(false); // don't persist this setting
    const [dataToDownload, setDataToDownload] = useState<string>("all-raw-data")
    const [minutesPerParticipant, setMinutesPerParticipant] = useSetting<number>(AppSettings.MINUTES_ALLOTTED_PER_PARTICIPANT)
    const [maskList, setMaskList] = useSetting<string[]>(AppSettings.MASK_LIST)
    const [todayParticipantList, setTodayParticipantList] = useSetting<string[]>(AppSettings.PARTICIPANT_LIST)
    const [colorScheme, setColorScheme] = useSetting<string>(AppSettings.COLOR_SCHEME)
    const [eventEndDate, setEventEndDate] = useState<Date>(appContext.settings.eventEndTime)
    const [connectionStatus] = useSetting<ConnectionStatus>(AppSettings.CONNECTION_STATUS)
    const [enableTesterMode] = useSetting<boolean>(AppSettings.ENABLE_TESTER_MODE)

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
        <div>
            <fieldset>
                {`mftc v${__APP_VERSION__} ${import.meta.env.MODE}`}
            </fieldset>

            {enableTesterMode
                ? <div id="tester-settings-panel" style={{display: "flex", height: "inherit"}}>
                    <fieldset>
                        <legend>Settings</legend>
                        <section id="settings" style={{
                            display: "flex",
                            flexDirection: "row",
                            flexWrap: "wrap",
                            justifyContent: "center",
                            alignItems: "stretch",
                        }}>
                            <section id={"display-settings"}>
                                <fieldset>
                                    <legend>Display</legend>
                                    <BooleanSettingToggleButton setting={AppSettings.KEEP_SCREEN_AWAKE}/>
                                    <SettingsSelect label={"Color Scheme"} value={colorScheme}
                                                    setValue={(value) => setColorScheme(value)}
                                                    options={[
                                                        {"Auto": "light dark"},
                                                        {"Dark": "dark"},
                                                        {"Light": "light"},
                                                    ]}/>
                                    <BooleanSettingToggleButton setting={AppSettings.ENABLE_TEST_INSTRUCTIONS_ZOOM}/>
                                    <BooleanSettingToggleButton setting={AppSettings.SHOW_MASK_PERF_GRAPH}/>
                                </fieldset>
                            </section>
                            <section id={"speech-controls"}>
                                <fieldset>
                                    <legend>Speech</legend>
                                    <EnableSpeechSwitch/>
                                    <BooleanSettingToggleButton setting={AppSettings.SAY_PARTICLE_COUNT}/>
                                    <BooleanSettingToggleButton setting={AppSettings.SAY_ESTIMATED_FIT_FACTOR}/>
                                    <SpeechVoiceSelectorWidget/>
                                    <BooleanSettingToggleButton trueLabel={"Verbose speech"}
                                                                setting={AppSettings.VERBOSE}/>
                                </fieldset>
                            </section>
                            <section id={"event-settings"}>
                                <fieldset>
                                    <legend>Event</legend>
                                    <BooleanSettingToggleButton setting={AppSettings.SHOW_ELAPSED_PARTICIPANT_TIME}/>
                                    <div className={"labeled-setting"}>
                                        <label htmlFor={"minutes-per-participant-input"}>Minutes per
                                            participant:</label>
                                        <DebouncedInput style={{width: "8ch"}} id={"minutes-per-participant-input"}
                                                        value={minutesPerParticipant}
                                                        onChange={handleMinutesPerParticipantChanged}
                                                        type="number" min={1} max={60}
                                        />
                                    </div>
                                    <BooleanSettingToggleButton setting={AppSettings.SHOW_REMAINING_EVENT_TIME}/>
                                    <div className={"labeled-setting"}>
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
                                    </div>
                                    <fieldset id={"today-participant-list"}>
                                        <legend>{"Participants"}</legend>
                                        <div style={{maxHeight: "50vh"}}>
                                            <SmartTextArea
                                                scrollable={true}
                                                onChangeOnlyOnBlur={true}
                                                initialValue={todayParticipantList.join("\n")}
                                                onChange={(value) => {
                                                    if (value !== undefined) {
                                                        setTodayParticipantList(value.split(/\n/).map((line) => line.trim()).filter((line) => line.length > 0));
                                                    }
                                                }}/>
                                        </div>
                                    </fieldset>
                                </fieldset>
                            </section>
                            <section id={"connection"}>
                                <fieldset>
                                    <legend>Connection</legend>
                                    <div style={{display: "inline-block"}}>
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
                                        <BooleanSettingToggleButton setting={AppSettings.AUTO_DETECT_BAUD_RATE}/>
                                        <BooleanSettingToggleButton setting={AppSettings.ENABLE_WEB_SERIAL_DRIVERS}/>
                                        <BooleanSettingToggleButton setting={AppSettings.ENABLE_AUTO_CONNECT}/>
                                    </div>
                                </fieldset>
                            </section>
                            <section id={"data-settings"}>
                                <fieldset>
                                    <legend>Data</legend>
                                    <div style={{display: "inline-block"}}>
                                        <BooleanSettingToggleButton setting={AppSettings.SYNC_DEVICE_STATE_ON_CONNECT}/>
                                        <BooleanSettingToggleButton setting={AppSettings.AUTO_UPDATE_MASK_LIST}/>
                                        <BooleanSettingToggleButton setting={AppSettings.NORMALIZE_MASK_LIST_NAMES}/>
                                        <BooleanSettingToggleButton setting={AppSettings.AUTO_CREATE_FAST_PROTOCOLS}/>
                                        <div className={"labeled-setting"}>
                                            <select id="download-file-format-selector" defaultValue={dataToDownload}
                                                    onChange={downloadFileFormatChanged}>
                                                <option value="all-raw-data">All Raw data as JSON</option>
                                                <option value="all-results-as-json">All results as JSON</option>
                                            </select>
                                            <input className="button" type="button" value="Download!"
                                                   id="download-button"
                                                   onClick={downloadButtonClickHandler}/>
                                        </div>
                                    </div>
                                </fieldset>
                            </section>
                            <section id={"advanced-controls"}>
                                <fieldset>
                                    <legend>Advanced</legend>
                                    <div style={{display: "inline-block"}}>
                                        <BooleanSettingToggleButton setting={AppSettings.ENABLE_TESTER_MODE}/>
                                        <BooleanSettingToggleButton setting={AppSettings.USE_IDLE_AMBIENT_VALUES}/>
                                        <BooleanSettingToggleButton setting={AppSettings.SAMPLE_MASK_WHEN_IDLE}/>
                                        <BooleanSettingToggleButton setting={AppSettings.SHOW_STDDEV}/>
                                        <BooleanSettingToggleButton
                                            setting={AppSettings.ENABLE_SIMULATOR}/>
                                        <BooleanToggleButton trueLabel={"Show Danger Zone"}
                                                             value={showDangerZoneSettings}
                                                             setValue={setShowDangerZoneSettings}/>
                                    </div>
                                </fieldset>
                                {showDangerZoneSettings && <fieldset>
                                    <legend className={"svg-container"}
                                            style={{backgroundColor: "red", color: "whitesmoke"}}>
                                        <PiWarningOctagonBold/><FaRadiation/> Danger
                                        Zone <FaRadiation/><PiWarningOctagonBold/>
                                    </legend>
                                    <input type={"button"} value={"Clear Local Storage"}
                                           onClick={() => localStorage.clear()}/>
                                </fieldset>}
                            </section>
                            <fieldset id={"mask-list"}>
                                <legend>Mask list</legend>
                                <div style={{maxHeight: "50vh"}}>
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
                                <div className={"inline-flex"}>
                                    <DriverSelectorWidget compact={true}/>
                                    <button onClick={fetchSettingsAndStateInfo}
                                            disabled={connectionStatus !== ConnectionStatus.RECEIVING}>Fetch settings &
                                        state
                                        info
                                    </button>
                                </div>
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
                                <InfoBox
                                    label={"Mask Purge"}>{formatDuration(1000 * portaCountSettings.maskPurge)}</InfoBox>
                                {/*mask sample*/}
                                {
                                    [...portaCountSettings.maskSample.entries()].map(([index, value]) => <InfoBox
                                        key={index}
                                        label={`Ex ${String(index)} sample`}>{formatDuration(1000 * value)}</InfoBox>)
                                }

                                {/*ff pass levels*/}
                                {
                                    [...portaCountSettings.fitFactorPassLevel.entries()].map(([index, value]) =>
                                        <InfoBox
                                            key={index} label={`FF pass level ${String(index)}`}>{value}</InfoBox>)
                                }

                                <InfoBox label={"Battery"}>{portaCountState.batteryStatus}</InfoBox>
                                <InfoBox label={"Pulse"}>{portaCountState.pulseStatus}</InfoBox>
                                {
                                    [...portaCountState.componentVoltages.entries()].map(([component, value]) =>
                                        <InfoBox
                                            key={component} label={`${component} voltage`}>{value}</InfoBox>)
                                }
                            </fieldset>
                        </section>
                    </fieldset>
                </div>
                : <div id="viewer-settings-panel" style={{display: "flex", height: "inherit"}}>
                    <fieldset>
                        <legend>Settings</legend>
                        <section id="settings" style={{
                            display: "flex",
                            flexDirection: "row",
                            flexWrap: "wrap",
                            justifyContent: "center",
                            alignItems: "stretch",
                        }}>
                            <section id={"advanced-controls"}>
                                <fieldset>
                                    <legend>Advanced</legend>
                                    <div style={{display: "inline-block"}}>
                                        <BooleanSettingToggleButton setting={AppSettings.ENABLE_TESTER_MODE}/>
                                    </div>
                                </fieldset>
                            </section>
                        </section>
                    </fieldset>
                </div>}
        </div>)
}
