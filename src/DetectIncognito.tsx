import detectIncognito from "detectincognitojs";
import {useEffect, useState} from "react";

type DetectIncognitoParams = {
    altUrl: string|null,
}

export function DetectIncognito(props: DetectIncognitoParams) {
    const [isPrivateBrowsing, setIsPrivateBrowsing] = useState<boolean>(false);
    useEffect(() => {
        detectIncognito().then((result) => setIsPrivateBrowsing(result.isPrivate))
    }, []);
    return (
        <>{isPrivateBrowsing && <p>
            <h1>This is a private browsing window. Results will not be saved beyond the current session. </h1>
            {props.altUrl && <a href={props.altUrl}>Open this link in a normal window to save results.</a>}
        </p>
        }</>
    );
}
