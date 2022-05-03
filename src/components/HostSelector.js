import {useEffect, useState} from "react";
import {neutronServerApi} from "../common/requests";
import {Select} from "antd";
import {getHostNickname, setHostNickname, setHostUUID} from "../common/utils";


export default function HostSelector() {
    const [hosts, setHosts] = useState([]);
    const listHosts = hosts.map((host) =>
        <Select.Option key={host['uuid']} value={host['uuid']}>{host['nickname']}</Select.Option>
    );

    useEffect(() => {
        getHosts();
    }, [])

    function getHosts() {
        neutronServerApi({
            url: '/host',
            method: 'get',
        }).then((resp) => {
            setHosts(resp.data);
        });
    }

    function handleHostChange(uuid) {
        setHostUUID(uuid);
        for (let i = 0; i < hosts.length; i++) {
            if (hosts[i]['uuid'] === uuid) {
                setHostNickname(hosts[i]['nickname']);
            }
        }
        window.location.reload();
    }

    return (
        <Select defaultValue={getHostNickname()} style={{ width: 120 }}
                onChange={handleHostChange}>
            {listHosts}
        </Select>
    );
}