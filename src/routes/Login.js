import React from 'react';
import {getToken, getUUID, removeToken, setToken} from "../common/utils";
import {Navigate, useLocation, useNavigate} from "react-router-dom";
import {neutronServerApi} from "../common/requests";
import {message} from "antd";


export default function Login() {
    let navigate = useNavigate();
    let location = useLocation();
    let from = location.state?.from?.pathname || "/";

    function handleSubmit(e) {
        e.preventDefault();
        let formData = new FormData(e.currentTarget);
        let username = formData.get('username');
        let password = formData.get('password');
        console.log('username: ', username, ', password: ', password);

        neutronServerApi({
            url: '/user/token',
            method: 'post',
            data: new URLSearchParams({
                username: username,
                password: password,
            })
        })
            .then((resp) => {
                console.log('login: ', resp.data)
                let token = resp.data['token_type'] + ' ' + resp.data['access_token'];
                setToken(token)
                navigate(from, { replace: true });
            });
    }

    return (
        <form onSubmit={handleSubmit}>
            <label>
                username
                <input type="text" name="username" />
            </label>
            <label>
                password
                <input type="text" name="password" />
            </label>
            <input type="submit" value="登录" />
        </form>
    );
}


export function RequireAuth({ children }: { children: JSX.Element }) {
    let location = useLocation();
    let token = getToken();
    if (!token) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }
    return children;
}


export function logout() {
    console.log('begin logout');
    removeToken()
}
