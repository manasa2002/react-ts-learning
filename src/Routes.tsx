import { BrowserRouter, Route, Routes } from "react-router-dom";
import AppShell from "./components/Layout/AppShell";


export default function RoutesComponent() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<AppShell />} />
            </Routes>
        </BrowserRouter>
    )
}

