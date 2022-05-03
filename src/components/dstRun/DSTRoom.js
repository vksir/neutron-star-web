import React, {useEffect, useState} from "react";
import {Button, Space, message, Input} from "antd";
import {dstRunApi, neutronServerApi} from "../../common/requests";


export default function DSTRoom() {
    const [clusterName, setClusterName] = useState();
    const [clusterPassword, setClusterPassword] = useState();
    const [clusterDescription, setClusterDescription] = useState();
    const [gameMode, setGameMode] = useState();
    const [maxPlayers, setMaxPlayers] = useState();
    const [enablePvp, setEnablePvp] = useState();

    useEffect(() => {
        refreshRoom();
    }, []);

    function refreshRoom() {
        console.log('refreshRoom')
        dstRunApi({
            url: '/api/room',
            method: 'get',
        }).then((resp) => {
            console.log(resp.data)
            const network = resp.data['room'].NETWORK;
            console.log(network)
            setClusterName(network.cluster_name);
            setClusterPassword(network.cluster_password);
            setClusterDescription(network.cluster_description);

            const gamePlay = resp.data['room'].GAMEPLAY;
            setGameMode(gamePlay.game_mode);
            setMaxPlayers(gamePlay.max_players);
            setEnablePvp(gamePlay.pvp);
        });
    }

    function updateRoom() {
        dstRunApi({
            url: '/api/room',
            method: 'put',
            data: {
                GAMEPLAY: {
                    game_mode: gameMode,
                    max_players: maxPlayers,
                    pvp: enablePvp,
                },
                NETWORK: {
                    cluster_name: clusterName,
                    cluster_password: clusterPassword,
                    cluster_description: clusterDescription,
                }
            },
        }).then(() => {
            message.success('房间信息更新成功');
        });
    }

    return (
        <Space size="middle" direction="vertical" style={{
            width: "100%",
        }}>
            <h1>Room</h1>
            <div>
                <Input addonBefore="房间名" value={clusterName} onChange={(e) => setClusterName(e.target.value)}/>
                <Input addonBefore="房间密码" value={clusterPassword} onChange={(e) => setClusterPassword(e.target.value)}/>
                <Input addonBefore="房间描述" value={clusterDescription} onChange={(e) => setClusterDescription(e.target.value)}/>
                <Input addonBefore="游戏模式" value={gameMode} onChange={(e) => setGameMode(e.target.value)}/>
                <Input addonBefore="最大游戏人数" value={maxPlayers} onChange={(e) => setMaxPlayers(e.target.value)} type="number"/>
                <Input addonBefore="PVP" value={enablePvp} onChange={(e) => setEnablePvp(e.target.value)}/>
                <Button type="primary" onClick={updateRoom}>提交</Button>
            </div>
        </Space>
    );
}