import {SmartTextArea} from "src/SmartTextArea.tsx";
import {useSetting} from "src/use-setting.ts";
import {AppSettings} from "src/app-settings.ts";
import {ReactElement} from "react";

type TodayParticipantSelectorWidgetProps = {
    value?: string,
    onChange?: (participant: string) => void,
    label?: string | ReactElement,
};

export function TodayParticipantSelectorWidget(props: TodayParticipantSelectorWidgetProps) {
    const [participantList] = useSetting<string[]>(AppSettings.COMBINED_PARTICIPANT_LIST)

    function updateParticipant(participant: string) {
        if (props.onChange) {
            props.onChange(participant);
        }
    }

    return (
        <SmartTextArea
            id={"participant"}
            label={props.label}
            initialValue={props.value}
            onChangeOnlyOnBlur={true}
            autocompleteOptions={participantList.map((name) => {
                return {label: name, value: name}
            })}
            placeholder={"Click to add participant"}
            onChange={(value) => updateParticipant(value || "")}
        ></SmartTextArea>
    )
}
