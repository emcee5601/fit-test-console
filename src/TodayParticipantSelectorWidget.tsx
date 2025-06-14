import {SmartTextArea} from "src/SmartTextArea.tsx";
import {useSetting} from "src/use-setting.ts";
import {AppSettings} from "src/app-settings.ts";
import {enCaseInsensitiveCollator} from "src/utils.ts";

type TodayParticipantSelectorWidgetProps = {
    value?: string,
    onChange?: (participant: string) => void,
    label?: string,
};

export function TodayParticipantSelectorWidget(props: TodayParticipantSelectorWidgetProps) {
    const [participantList, setParticipantList] = useSetting<string[]>(AppSettings.TODAY_PARTICIPANTS)

    function updateParticipant(participant: string) {
        if (props.onChange) {
            props.onChange(participant);
        }

        // update the participant list
        setParticipantList((prev) => {
            return [...new Set([...prev, participant])].filter((item) => item && item.trim().length > 0).toSorted(enCaseInsensitiveCollator.compare)
        })
    }

    return (
        <SmartTextArea
            id={"participant"}
            label={props.label}
            initialValue={props.value}
            autocompleteOptions={participantList.map((name) => {
                return {label: name, value: name}
            })}
            placeholder={"Click to add participant"}
            onChange={(value) => updateParticipant(value || "")}
        ></SmartTextArea>
    )
}
