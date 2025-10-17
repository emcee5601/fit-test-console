import {useRef} from "react";
import {GiHamburgerMenu} from "react-icons/gi";
import {NavLink} from "react-router";
import {SelectOption} from "src/ActionMenuWidget.tsx";
import {OverlayPanelWidget} from "src/OverlayPanelWidget.tsx";

type MenuWidgetProps = {
    options: SelectOption[],
}

export function MenuWidget(props: MenuWidgetProps) {
    const dismissMenuRef = useRef<CallableFunction>();

    function dismissMenu() {
        if (dismissMenuRef.current) {
            dismissMenuRef.current()
        }
    }

    return (
        <OverlayPanelWidget dismissOverlay={dismissMenuRef} buttonIcon={<GiHamburgerMenu className={"nav-icon"}/>} position={"left"}>
            {props.options.map((option: SelectOption) =>
                <NavLink key={option.label} to={option.value} className={({
                    isActive,
                    isPending
                }) => isPending ? "nav-link-pending" : isActive ? "nav-link-active" : ""}
                         viewTransition
                         onClick={dismissMenu}
                >
                    <div className={"no-wrap"} style={{display: "flex", fontSize:"1.5em"}}>{option.label}</div>
                </NavLink>
            )}
        </OverlayPanelWidget>
    )
}
