import {StrictMode, Suspense} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import {HashRouter, Route, Routes} from "react-router";
import {BookmarksPanel} from "src/BookmarksPanel.tsx";
import {DailyChecksPanel} from "src/DailyChecksPanel.tsx";
import {HelpPanel} from "src/HelpPanel.tsx";
import MainLayout from "src/MainLayout.tsx";
import {HomePanel} from "src/HomePanel.tsx";
import {ParticipantPanel} from "src/ParticipantPanel.tsx";
import {QRScanner} from "src/QRScanner.tsx";
import {ResultViewer} from "src/ResultViewer.tsx";
import {SimpleFitTestProtocolPanel} from "src/SimpleFitTestProtocolPanel.tsx";
import {StatsPanel} from "src/StatsPanel.tsx";
import {TestPanel} from "src/TestPanel.tsx";
import {registerSW} from "virtual:pwa-register";
import {DataCollectorPanel} from "./DataCollectorPanel.tsx";
import {SettingsPanel} from "./SettingsPanel.tsx";
import {UnsupportedBrowser} from './UnsupportedBrowser.tsx';

// add this to prompt for a refresh
const updateSW = registerSW({
    onNeedRefresh() {
        if (confirm("A new version is available. Update to the latest version?")) {
            updateSW(true);
        }
    },
});



createRoot(document.getElementById('root')!).render(
    <StrictMode>
        {/*use HashRouter because we can't get github to redirect all routes to index.html*/}
        <HashRouter>
            <Suspense fallback={"..."}>
                <Routes>
                    <Route path="" element={<MainLayout/>}>
                        <Route index element={<HomePanel/>}/>
                        <Route path="test" element={<TestPanel/>}/>
                        <Route path="participant" element={<ParticipantPanel/>}/>
                        <Route path="view-results" element={<ResultViewer/>}/>
                        <Route path="settings" element={<SettingsPanel/>}/>
                        <Route path="protocols" element={<SimpleFitTestProtocolPanel/>}/>
                        <Route path="raw-data" element={<DataCollectorPanel/>}/>
                        <Route path={"stats"} element={<StatsPanel/>}/>
                        <Route path={"qrscanner"} element={<QRScanner/>}/>
                        <Route path={"unsupported-browser"} element={<UnsupportedBrowser/>}/>
                        <Route path={"daily-checks"} element={<DailyChecksPanel/>}/>
                        <Route path={"bookmarks"} element={<BookmarksPanel/>}/>
                        <Route path={"help"} element={<HelpPanel/>}/>
                    </Route>
                </Routes>
            </Suspense>
        </HashRouter>
    </StrictMode>
)
