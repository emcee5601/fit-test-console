import {StrictMode, Suspense} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {registerSW} from "virtual:pwa-register";
import {HashRouter, Route, Routes} from "react-router";
import {SettingsPanel} from "./SettingsPanel.tsx";
import {DataCollectorPanel} from "./DataCollectorPanel.tsx";
import {StatsPanel} from "src/StatsPanel.tsx";
import {UnsupportedBrowser} from './UnsupportedBrowser.tsx';
import MainLayout from "src/MainLayout.tsx";
import {ResultViewer} from "src/ResultViewer.tsx";
import {QRScanner, SimpleFitTestProtocolPanel} from "src/lazy-components.ts";

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
                        <Route index element={<App/>}/>
                        <Route path="view-results" element={<ResultViewer/>}/>
                        <Route path="settings" element={<SettingsPanel/>}/>
                        <Route path="protocols" element={<SimpleFitTestProtocolPanel/>}/>
                        <Route path="raw-data" element={<DataCollectorPanel/>}/>
                        <Route path={"stats"} element={<StatsPanel/>}/>
                        <Route path={"qrscanner"} element={<QRScanner/>}/>
                        <Route path={"unsupported-browser"} element={<UnsupportedBrowser/>}/>
                    </Route>
                </Routes>
            </Suspense>
        </HashRouter>
    </StrictMode>
)
