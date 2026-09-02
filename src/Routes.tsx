import { BrowserRouter, Route, Routes } from "react-router-dom";
import AppShell from "./components/Layout/AppShell";
import Login from "./components/mainpage/Login";
import SignUp from "./components/mainpage/SignUp";
import Dashboard from "./components/Appshell/Dashboard";
import { HomePage } from "./components/mainpage/Homepage";
import Projects from "./components/Appshell/Projects";


export default function RoutesComponent() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route element={<AppShell />} >
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/projects" element={<Projects />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

