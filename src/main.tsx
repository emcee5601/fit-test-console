import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {registerSW} from "virtual:pwa-register";
import {BrowserRouter, Route, Routes} from "react-router";
import {ResultViewer} from "./ResultViewer.tsx";
import {SettingsPanel} from "./SettingsPanel.tsx";
import {MainLayout} from "./MainLayout.tsx";
import {SimpleFitTestProtocolPanel} from "./simple-protocol-editor.tsx";
import {DataCollectorPanel} from "./DataCollectorPanel.tsx";
import {EstimatedFitFactorPanel} from "./EstimatedFitFactorPanel.tsx";
import {StatsPanel} from "src/StatsPanel.tsx";

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
        <BrowserRouter basename="/fit-test-console">
            <Routes>
                <Route path="/" element={<MainLayout/>}>
                    <Route index element={<App/>}/>
                    <Route path="view-results" element={<ResultViewer/>}/>
                    <Route path="settings" element={<SettingsPanel/>}/>
                    <Route path="protocols" element={<SimpleFitTestProtocolPanel/>}/>
                    <Route path="raw-data" element={<DataCollectorPanel/>}/>
                    <Route path={"estimate"} element={<EstimatedFitFactorPanel/>}/>
                    <Route path={"stats"} element={<StatsPanel/>}/>
                </Route>
            </Routes>
        </BrowserRouter>
    </StrictMode>,
)
