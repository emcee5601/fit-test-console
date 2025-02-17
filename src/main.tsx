import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {registerSW} from "virtual:pwa-register";
import {BrowserRouter, Route, Routes} from "react-router";
import {ResultViewer} from "./ResultViewer.tsx";

// add this to prompt for a refresh
const updateSW = registerSW({
    onNeedRefresh() {
        if (confirm("New content available. Reload?")) {
            updateSW(true);
        }
    },
});

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/fit-test-console" element={<App/>} />
                <Route path="/fit-test-console/view-results" element={<ResultViewer/>} />
            </Routes>
        </BrowserRouter>
    </StrictMode>,
)
