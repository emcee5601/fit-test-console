import {SmartTextArea} from "src/SmartTextArea.tsx";
import {useSetting} from "src/use-setting.ts";
import {AppSettings} from "src/app-settings.ts";
import {enCaseInsensitiveCollator} from "src/utils.ts";

type TestNotesSelectorWidgetProps = {
    value?: string,
    onChange?: (notes: string) => void,
    label?: string,
};

export function TestNotesSelectorWidget(props: TestNotesSelectorWidgetProps) {
    const [notesList, setNotesList] = useSetting<string[]>(AppSettings.TEST_NOTES)

    function updateCurrentNotes(notes: string) {
        if (props.onChange) {
            props.onChange(notes);
        }

        // update the test notes list
        setNotesList((prev) => {
            return [...new Set([...prev, notes])].filter((item) => item && item.trim().length > 0).toSorted(enCaseInsensitiveCollator.compare)
        })
    }

    return (
        <SmartTextArea
            id={"notes"}
            label={props.label}
            initialValue={props.value}
            autocompleteOptions={notesList.map((notes) => {
                return {label: notes, value: notes}
            })}
            placeholder={"Click to add notes"}
            onChange={(value) => updateCurrentNotes(value || "")}
        ></SmartTextArea>

    )
}
