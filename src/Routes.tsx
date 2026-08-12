import { BrowserRouter, Route, Routes } from "react-router-dom";
import AppShell from "./components/Layout/AppShell";
import Login from "./components/mainpage/Login";


export default function RoutesComponent() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />

                <Route element={<AppShell />} >
                
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

