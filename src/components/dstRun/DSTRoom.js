import React, {useEffect, useState} from "react";
import {Button, Space, message, Input, Descriptions, InputNumber, Radio, Spin, Select} from "antd";
import {dstRunApi} from "../../common/requests";


export default function DSTRoom() {
    const [loading, setLoading] = useState(true);
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
            const network = resp.data['room'].NETWORK;
            setClusterName(network.cluster_name);
            setClusterPassword(network.cluster_password);
            setClusterDescription(network.cluster_description);

            const gamePlay = resp.data['room'].GAMEPLAY;
            setGameMode(gamePlay.game_mode);
            setMaxPlayers(gamePlay.max_players);
            setEnablePvp(gamePlay.pvp);
        }).finally(() => {
            setLoading(false);
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
        <Spin spinning={loading}>
            <Space direction="vertical" style={{width: "100%"}}>
                <h1>Room</h1>
                <Descriptions column={2} bordered size="small">
                    <Descriptions.Item label="房间名">
                        <Input
                            value={clusterName}
                            onChange={(e) => setClusterName(e.target.value)}
                        />
                    </Descriptions.Item>
                    <Descriptions.Item label="房间密码">
                        <Input
                            value={clusterPassword}
                            onChange={(e) => setClusterPassword(e.target.value)}
                        />
                    </Descriptions.Item>
                    <Descriptions.Item label="房间描述">
                        <Input
                            value={clusterDescription}
                            onChange={(e) => setClusterDescription(e.target.value)}
                        />
                    </Descriptions.Item>
                    <Descriptions.Item label="游戏模式">
                        <Select value={gameMode} onChange={setGameMode} style={{width: "50%"}}>
                            <Select.Option value="survival">生存</Select.Option>
                            <Select.Option value="wilderness">荒野</Select.Option>
                            <Select.Option value="endless">无尽</Select.Option>
                        </Select>
                    </Descriptions.Item>
                    <Descriptions.Item label="最大游戏人数">
                        <InputNumber
                            min={1}
                            max={256}
                            value={maxPlayers}
                            onChange={setMaxPlayers}
                            style={{width: "50%"}}
                        />
                    </Descriptions.Item>
                    <Descriptions.Item label="PVP">
                        <Radio.Group value={enablePvp} onChange={(e) => setEnablePvp(e.target.value)}>
                            <Radio value={false}>停用</Radio>
                            <Radio value={true}>启用</Radio>
                        </Radio.Group>
                    </Descriptions.Item>
                </Descriptions>
                <Space>
                    <Button type="primary" onClick={updateRoom}>提交</Button>
                    <Button onClick={refreshRoom}>取消</Button>
                </Space>
            </Space>
        </Spin>
    );
}