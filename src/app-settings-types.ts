import {DataSource} from "src/data-source.ts";
import {ParticleConcentrationEvent} from "src/portacount-client-8020.ts";
import {Activity, ConnectionStatus, SampleSource} from "src/portacount/porta-count-state.ts";
import {SegmentState} from "src/protocol-executor/segment-state.ts";
import {StandardStageDefinition} from "src/simple-protocol.ts";
import {SimpleResultsDBRecord} from "src/SimpleResultsDB.ts";

/**
 * this is for convenience. code outside of this module should use AppSettings enum.
 * Code within this module should ValidSettings and AppSettingsDefaults
 */
export enum AppSettings {
    SPEECH_ENABLED = "speech-enabled",
    SPEECH_VOICE = "speech-voice",
    VERBOSE = "verbose",
    SAY_PARTICLE_COUNT = "say-particle-count",
    RESULTS_TABLE_SORT = "results-table-sort",
    PARTICIPANT_RESULTS_TABLE_SORT = "participant-results-table-sort",
    SAY_ESTIMATED_FIT_FACTOR = "say-estimated-fit-factor",
    BAUD_RATE = "baud-rate",
    PROTOCOL_INSTRUCTION_SETS = "protocol-instruction-sets",
    SELECTED_PROTOCOL = "selected-protocol",
    KEEP_SCREEN_AWAKE = "keep-screen-awake",
    TEST_TEMPLATE = "test-template",
    ENABLE_SIMULATOR = "enable-simulator",
    ENABLE_AUTO_CONNECT = "enable-auto-connect",
    SIMULATOR_FILE_SPEED = "simulator-file-speed",
    SELECTED_DATA_SOURCE = "selected-data-source",
    SYNC_DEVICE_STATE_ON_CONNECT = "sync-device-state-on-connect",
    MINUTES_ALLOTTED_PER_PARTICIPANT = "minutes-allotted-per-participant",
    EVENT_END_HHMM = "event-end-hhmm", // in local time
    SHOW_ELAPSED_PARTICIPANT_TIME = "show-elapsed-participant-time",
    SHOW_REMAINING_EVENT_TIME = "show-remaining-event-time",
    AUTO_CREATE_FAST_PROTOCOLS = "auto-create-fast-protocols",
    ENABLE_WEB_SERIAL_DRIVERS = "enable-webserial-drivers",
    ENABLE_TEST_INSTRUCTIONS_ZOOM = "enable-test-instructions-zoom",
    BOOKMARKS = "bookmarks",
    MASK_LIST = "mask-list",
    PARTICIPANT_LIST = "participant-list",
    AUTO_UPDATE_MASK_LIST = "auto-update-mask-list",
    COLOR_SCHEME = "color-scheme",
    SHOW_MASK_PERF_GRAPH = "show-mask-perf-graph",
    SAMPLE_MASK_WHEN_IDLE = "sample-mask-when-idle",
    USE_IDLE_AMBIENT_VALUES = "use-idle-ambient-values",
    NORMALIZE_MASK_LIST_NAMES = "normalize-mask-list-names",
    AUTO_DETECT_BAUD_RATE = "auto-detect-baud-rate",
    ENABLE_TESTER_MODE = "enable-tester-mode",
    SHOW_STDDEV = "show-stddev",
    SHOW_SIMULATOR_RESULTS = "show-simulator-results",

    // session only settings (these start with "so-". todo: can we merge these from another enum into this?
    STATS_FIRST_DATE = "so-stats-first-date",
    STATS_LAST_DATE = "so-stats-last-date",
    RESULTS_TABLE_FILTER = "so-results-table-filter",
    PARTICIPANT_RESULTS_TABLE_FILTER = "so-participant-results-table-filter",
    COMBINED_MASK_LIST = "so-combined-mask-list",
    COMBINED_PARTICIPANT_LIST = "so-combined-participant-list",
    TEST_NOTES = "so-test-notes",
    CONNECTION_STATUS_IN_VIEW = "so-connection-status-in-view",
    ACTIVITY = "so-activity",
    ZOOM_INSTRUCTIONS = "so-zoom-instructions",
    CURRENT_AMBIENT_AVERAGE = "so-current-ambient-average",
    CURRENT_MASK_AVERAGE = "so-current-mask-average",
    CONNECTION_STATUS = "so-connection-status",
    PROTOCOL_EXECUTION_STATE = "so-protocol-execution-state",
    PROTOCOL_START_TIME = "so-protocol-start-time",
    STAGE_START_TIME = "so-stage-start-time",
    CURRENT_STAGE_INDEX = "so-current-stage-index",


    // these are deprecated:
    DEFAULT_TO_PREVIOUS_PARTICIPANT = "default-to-previous-participant",
    AUTO_ESTIMATE_FIT_FACTOR = "auto-estimate-fit-factor",
    SHOW_PROTOCOL_EDITOR = "show-protocol-editor",
    SHOW_SIMPLE_PROTOCOL_EDITOR = "show-simple-protocol-editor",
    SHOW_SETTINGS = "show-settings",
    SHOW_LOG_PANELS = "show-log-panels",
    SHOW_HISTORICAL_TESTS = "show-historical-tests",
    SHOW_CURRENT_TEST_PANEL = "show-current-test-panel",
    SHOW_EXTERNAL_CONTROL = "show-external-control",
    ENABLE_PROTOCOL_EDITOR = "enable-protocol-editor",
    ENABLE_QR_CODE_SCANNER = "enable-qr-code-scanner",
    ENABLE_STATS = "enable-stats",
    USE_COMPACT_UI = "use-compact-ui",
    ADVANCED_MODE = "advanced-mode",
    CONTROL_SOURCE_IN_VIEW = "so-control-source-in-view",
    SAMPLE_SOURCE_IN_VIEW = "so-sample-source-in-view",
    IS_PROTOCOL_RUNNING = "so-is-protocol-running",
    LAST_KNOWN_SETTINGS_KEYS_HASH = "last-known-settings-keys-hash", // hash of sorted settings keys
} // this class should use AppSettingsType for type checking/ validations to ensure every setting has a default.
/**
 * Settings can be of these types.
 */
export type AppSettingType = unknown
// boolean
// | string
// | string[]
// | number
// | JSONContent
// | SortingState
// | ColumnFiltersState
// | Partial<SimpleResultsDBRecord>
// | Date;

/**
 * Settings names and default values.
 * Keys are the database keys, so we must preserve what we have previously used (or convert)
 */
export const AppSettingsDefaults = {
    "speech-enabled": false,
    "advanced-mode": false,
    "speech-voice": "default",
    "verbose": false,
    "say-particle-count": false,
    "results-table-sort": [{
        id: 'ID',
        desc: true,
    }],
    "participant-results-table-sort": [{
        id: 'ID',
        desc: true,
    }],
    "auto-estimate-fit-factor": false,
    "say-estimated-fit-factor": false,
    "show-external-control": false,
    "baud-rate": 1200,
    "protocol-instruction-sets": {
        "json": {
            "w1": [
                "Normal breathing. Breathe normally",
                "Heavy breathing. Take deep breaths.",
                [
                    "Jaw movement.",
                    "Read the rainbow passage:",
                    "When the sunlight strikes raindrops in the air, they act as a prism and form a rainbow.",
                    "The rainbow is a division of white light into many beautiful colors.",
                    "These take the shape of a long round arch, with its path high above,",
                    "and its two ends apparently beyond the horizon.",
                    "There is, according to legend, a boiling pot of gold at one end.",
                    "People look, but no one ever finds it.",
                    "When a man looks for something beyond his reach,",
                    "his friends say he is looking for the pot of gold at the end of the rainbow."
                ].join(" "),
                "Head movement. Look up, down, left, and right. Repeat."
            ],
            "Modified CNC (B)": [
                {
                    "instructions": "prep",
                    "ambient_purge": 4,
                    "ambient_sample": 20,
                    "mask_purge": 0,
                    "mask_sample": 0
                },
                {
                    "instructions": "Bending over. Bend at the waist as if going to touch your toes. Inhale 2 times at the bottom.",
                    "ambient_purge": 0,
                    "ambient_sample": 0,
                    "mask_purge": 4,
                    "mask_sample": 30
                },
                {
                    "instructions": ["Talking.",
                        "Talk out loud slowly and loud enough to be head by the test administrator.",
                        "Count backwards from 100,",
                        "or read the Rainbow Passage:",
                        "When the sunlight strikes raindrops in the air, they act as a prism and form a rainbow.",
                        "The rainbow is a division of white light into many beautiful colors.",
                        "These take the shape of a long round arch, with its path high above,",
                        "and its two ends apparently beyond the horizon.",
                        "There is, according to legend, a boiling pot of gold at one end.",
                        "People look, but no one ever finds it.",
                        "When a man looks for something beyond his reach,",
                        "his friends say he is looking for the pot of gold at the end of the rainbow."
                    ].join(" "),
                    "ambient_purge": 0,
                    "ambient_sample": 0,
                    "mask_purge": 4,
                    "mask_sample": 30
                },
                {
                    "instructions": "Head side-to-side. Slowly turn head from side to side. Inhale 2 times at each extreme.",
                    "ambient_purge": 0,
                    "ambient_sample": 0,
                    "mask_purge": 4,
                    "mask_sample": 30
                },
                {
                    "instructions": "Head up-and-down. Slowly move head up and down. Inhale 2 times at each extreme.",
                    "ambient_purge": 0,
                    "ambient_sample": 0,
                    "mask_purge": 4,
                    "mask_sample": 30
                },
                {
                    "instructions": "finalize",
                    "ambient_purge": 4,
                    "ambient_sample": 9,
                    "mask_purge": 0,
                    "mask_sample": 0
                }
            ],
            "osha": [
                "Normal breathing. In a normal standing position, without talking, the subject shall breathe normally",
                "Deep breathing. In a normal standing position, the subject shall breathe slowly and deeply, taking caution so as not to hyperventilate",
                "Turning head side to side. Standing in place, the subject shall slowly turn his/her head from side to side between the extreme positions on each side. The head shall be held at each extreme momentarily so the subject can inhale at each side.",
                "Moving head up and down. Standing in place, the subject shall slowly move his/her head up and down. The subject shall be instructed to inhale in the up position (i.e., when looking toward the ceiling).",
                "Talking. The subject shall talk out loud slowly and loud enough so as to be heard clearly by the test conductor. The subject can read from a prepared text such as the Rainbow Passage, count backward from 100, or recite a memorized poem or song.",
                "Grimace. The test subject shall grimace by smiling or frowning. (This applies only to QNFT testing; it is not performed for QLFT)",
                "Bending over. The test subject shall bend at the waist as if he/she were to touch his/her toes. Jogging in place shall be substituted for this exercise in those test environments such as shroud type QNFT or QLFT units that do not permit bending over at the waist.",
                "Normal breathing. Same as exercise (1)."
            ],
            "Singing": [
                {
                    "ambient_purge": 4,
                    "ambient_sample": 20,
                    "instructions": "prep",
                    "mask_purge": 0,
                    "mask_sample": 0
                },
                {
                    "ambient_purge": 0,
                    "ambient_sample": 0,
                    "instructions": "Sing!",
                    "mask_purge": 4,
                    "mask_sample": 240
                },
                {
                    "ambient_purge": 4,
                    "ambient_sample": 9,
                    "instructions": "finalize",
                    "mask_purge": 0,
                    "mask_sample": 0
                }
            ],
        }
    },
    "selected-protocol": "w1",
    "keep-screen-awake": true,
    "test-template": {} as Partial<SimpleResultsDBRecord>,
    "enable-simulator": false,
    "enable-auto-connect": true,
    "simulator-file-speed": 300, // baud
    "selected-data-source": DataSource.WebSerial,
    "sync-device-state-on-connect": false,
    "minutes-allotted-per-participant": 20,
    "event-end-hhmm": "13:30", // 1:30p. use a divider for easier parsing
    "show-elapsed-participant-time": false,
    "show-remaining-event-time": false,
    "auto-create-fast-protocols": false,
    "last-known-settings-keys-hash": "",
    "use-compact-ui": true,
    "enable-webserial-drivers": false, // I don't normally use this so disable by default.
    "enable-protocol-editor": false,
    "enable-qr-code-scanner": false,
    "enable-stats": false,
    "enable-test-instructions-zoom": false,
    "bookmarks": {},
    "mask-list": [],
    "participant-list": [],
    "auto-update-mask-list": true,
    "color-scheme": "auto",
    "show-mask-perf-graph": false,
    "sample-mask-when-idle": false,
    "use-idle-ambient-values": false,
    "normalize-mask-list-names": true,
    "auto-detect-baud-rate": true,
    "enable-tester-mode": false,
    "show-stddev": false,
    "show-simulator-results": true,

    "so-stats-first-date": new Date(0), // epoch, sentinel value
    "so-stats-last-date": new Date(), // today
    "so-results-table-filter": [],
    "so-participant-results-table-filter": [],
    "so-combined-mask-list": [],
    "so-combined-participant-list": [],
    "so-test-notes": [],
    "so-control-source-in-view": true,
    "so-sample-source-in-view": true,
    "so-connection-status-in-view": true,
    "so-activity": Activity.Disconnected,
    "so-zoom-instructions": false,
    "so-current-ambient-average": NaN,
    "so-current-mask-average": NaN,
    "so-is-protocol-running": false,
    "so-connection-status": ConnectionStatus.DISCONNECTED,
    "so-protocol-execution-state": "Idle",
    "so-protocol-start-time" : 0,
    "so-stage-start-time" : 0,
    "so-current-stage-index": 0,

    "default-to-previous-participant": false, // deprecated
    "show-protocol-editor": false, // deprecated
    "show-simple-protocol-editor": false, // deprecated
    "show-settings": false, // deprecated
    "show-log-panels": false, // deprecated
    "show-historical-tests": false, // deprecated
    "show-current-test-panel": false, // deprecated
}
export type ValidSettings = keyof typeof AppSettingsDefaults;

// todo: rename this to phase? so we don't share the same first letter as Stage
export type ProtocolSegment = {
    index: number, // segment index
    stage: StandardStageDefinition,
    stageIndex: number,
    exerciseNumber: number | null, // this is usually stageIndex+1 (to be 1-based), but sometimes it's shifted by some
                                   // amount, in order to skip 0-duration stages
    state: SegmentState,
    source: SampleSource,
    protocolStartTimeOffsetSeconds: number, // to help with pointer
    stageStartTimeOffsetSeconds: number, // helper
    segmentStartTimeMs?: number, // epoch time
    duration: number,
    data: ParticleConcentrationEvent[], // todo: trim this down to timestamp and concentration?
    calculatedScore?: number // FF. keep it here since we can revise it with more ambient info
}
