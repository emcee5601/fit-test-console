import "./MenuWidget.css"
import {useRef} from "react";
import {GiHamburgerMenu} from "react-icons/gi";
import {NavLink} from "react-router";
import {SelectOption} from "src/ActionMenuWidget.tsx";

type MenuWidgetProps = {
    options: SelectOption[],
}

export function MenuWidget(props: MenuWidgetProps) {
    const ref = useRef<HTMLInputElement>(null);

    function dismissMenu() {
        if (ref.current) {
            ref.current.checked = false
        }
    }

    return (
        <div style={{display: "block"}}>
            <input className="header-toggle-menu" id="header-menu" type="checkbox" ref={ref}/>
            <label className="header-menu-button" htmlFor="header-menu"><GiHamburgerMenu/></label>
            <label className="header-menu-overlay" htmlFor="header-menu"></label>
            <div className={"header-nav"}>
                {props.options.map((option: SelectOption) =>
                    <NavLink key={option.label} to={option.value} className={({
                        isActive,
                        isPending
                    }) => isPending ? "nav-link-pending" : isActive ? "nav-link-active" : ""}
                             viewTransition
                             onClick={() => dismissMenu()}
                    >
                        <div className={"no-wrap"} style={{display:"flex"}}>{option.label}</div>
                    </NavLink>
                )}
            </div>
        </div>
    )
}
