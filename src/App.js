import React, {lazy} from 'react';
import {BrowserRouter as Router, Navigate, Route, Routes} from 'react-router-dom';
import './App.css';
import {RequireAuth} from "./components/Login";
import DSTControl from "./components/dstRun/DSTControl";
import DSTCluster from "./components/dstRun/DSTCluster";
import DSTRoom from "./components/dstRun/DSTRoom";
import DSTWorld from "./components/dstRun/DSTWorld";
import DSTMod from "./components/dstRun/DSTMod";


const Home = lazy(() => import('./components/MainPage'));
const Login = lazy(() => import('./components/Login'));


export default function App() {
    return (
        <Router>
            <Routes>
                <Route element={<Home/>}>
                    <Route path="/" element={
                        <Navigate to="/dst/control" replace />
                    }/>
                    <Route path="/dst/control" element={
                        <RequireAuth>
                            <DSTControl/>
                        </RequireAuth>
                    }/>
                    <Route path="/dst/room" element={
                        <RequireAuth>
                            <DSTRoom/>
                        </RequireAuth>
                    }/>
                    <Route path="/dst/world" element={
                        <RequireAuth>
                            <DSTWorld/>
                        </RequireAuth>
                    }/>
                    <Route path="/dst/mod" element={
                        <RequireAuth>
                            <DSTMod/>
                        </RequireAuth>
                    }/>
                    <Route path="/dst/cluster" element={
                        <RequireAuth>
                            <DSTCluster/>
                        </RequireAuth>
                    }/>
                </Route>
                <Route path="/login" element={<Login/>}/>
                <Route path="*" element={
                    <Navigate to="/dst/control" replace />
                }/>
            </Routes>
        </Router>
    );
}




