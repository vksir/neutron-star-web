import React, {lazy} from 'react';
import {BrowserRouter as Router, Navigate, Route, Routes} from 'react-router-dom';
import './App.css';
import {RequireAuth} from "./routes/Login";

import DSTControl from "./components/dstRun/DSTControl";
import DSTCluster from "./components/dstRun/DSTCluster";
import DSTTemplate from "./components/dstRun/DSTTemplate";
import DSTRoom from "./components/dstRun/DSTRoom";
import DSTMaster from "./components/dstRun/DSTMaster";
import DSTCaves from "./components/dstRun/DSTCaves";
import DSTMod from "./components/dstRun/DSTMod";

const Home = lazy(() => import('./routes/Home'));
const Login = lazy(() => import('./routes/Login'));



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
                    <Route path="/dst/world/master" element={
                        <RequireAuth>
                            <DSTMaster/>
                        </RequireAuth>
                    }/>
                    <Route path="/dst/world/caves" element={
                        <RequireAuth>
                            <DSTCaves/>
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
                    <Route path="/dst/template" element={
                        <RequireAuth>
                            <DSTTemplate/>
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




