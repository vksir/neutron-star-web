import axios from "axios";
import {getHostUUID, getToken} from "./utils";
import {logout} from "../components/Login";
import {message, notification} from "antd";
import {CloseCircleOutlined, SmileOutlined} from "@ant-design/icons";

const neutronServerApi = axios.create({});
const dstRunApi = axios.create({});

const baseRequest = [
    (config) => {
        config.baseURL = '/ns_server/';
        let token = getToken();
        if (token) {
            config.headers['authorization'] = token;
        }
        let uuid = getHostUUID();
        if (uuid) {
            config.headers['uuid'] = uuid;
        }
        return config;
    },
    (error) => {
        console.log();
        notification.open({
            message: 'request failed: ' + error.response.status,
            description: JSON.stringify(error.response.data),
            icon: <CloseCircleOutlined style={{ color: '#e31111' }} />,
            duration: null,
        });
        return Promise.reject(error);
    }
]

const baseResponse = [
    (response) => {
        return response;
    },
    (error) => {
        notification.open({
            message: 'response failed: ' + error.response.status,
            description: JSON.stringify(error.response.data),
            icon: <CloseCircleOutlined style={{ color: '#e31111' }} />,
            duration: null,
        });
        if (error.response.status === 401) {
            logout();
        }
        return Promise.reject(error);
    }
]

neutronServerApi.interceptors.request.use(...baseRequest);
neutronServerApi.interceptors.response.use(...baseResponse);

dstRunApi.interceptors.request.use(...baseRequest);
dstRunApi.interceptors.response.use(...baseResponse);
dstRunApi.interceptors.request.use((config) => {
    config.headers['component'] = 'dst_run';
    return config;
});

export {neutronServerApi, dstRunApi};