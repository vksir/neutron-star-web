import React, {useEffect, useState} from "react";
import {dstRunApi, neutronServerApi} from "../../common/requests";
import {Button, Col, Row, Space, message, List, Input} from "antd";

export default function DSTControl() {
    const [status, setStatus] = useState('');
    useEffect(() => {
        refreshStatus();
        const interval = setInterval(refreshStatus, 5000);
        return () => {
            clearInterval(interval);
        }
    }, []);
    function refreshStatus() {
        console.log('refreshStatus')
        dstRunApi({
            url: '/api/server/status',
            method: 'get',
        }).then((resp) => {
            setStatus(resp.data['status']);
        });
    }

    function serveAction(action) {
        const key = action;
        const info = {
            'start': ['饥荒服务器正在启动', '饥荒服务器启动成功', '饥荒服务器启动失败'],
            'stop': ['饥荒服务器正在停止', '饥荒服务器停止成功', '饥荒服务器停止失败'],
            'restart': ['饥荒服务器正在重启', '饥荒服务器停止重启', '饥荒服务器重启失败'],
            'update': ['饥荒服务器正在更新', '饥荒服务器更新成功', '饥荒服务器更新失败'],
            'regenerate': ['饥荒世界正在生成', '饥荒世界生成成功', '饥荒世界生成失败'],
        };
        message.loading({content: info[action][0], key});
        dstRunApi({
            url: '/api/action/' + action,
            method: 'post',
        }).then(() => {
            message.success({content: info[action][1], key});
        }).catch(() => {
            message.error({content: info[action][2], key});
        });
    }

    const [players, setPlayers] = useState([]);
    function listPlayer() {
        dstRunApi({
            url: '/api/server/player_list',
            method: 'get',
        }).then((resp) => {
            const players = resp.data['players'];
            if (players == null) {
                message.error('listPlayers failed: ' + resp.data['detail']);
                return;
            }
            setPlayers(players);
        });
    }

    const [announceMsg, setAnnounceMsg] = useState('');
    function serverAnnounce() {
        dstRunApi({
            url: '/api/server/announce/' + announceMsg,

            method: 'post',
        }).then(() => {
            message.success('全服宣告成功：' + announceMsg);
            setAnnounceMsg('');
        });
    }

    function serverRegenerate() {
        dstRunApi({
            url: '/api/server/regenerate',
            method: 'post',
        }).then(() => {
            message.success('世界开始重新生成');
        });
    }

    const [rollbackDays, setRollbackDays] = useState(0);
    function serverRollback() {
        dstRunApi({
            url: '/api/server/rollback/' + rollbackDays,
            method: 'post',
        }).then(() => {
            message.success('世界开始回滚: ' + rollbackDays + ' 天');
        });
    }

    const [cmd, setCmd] = useState('');
    const [cmdResult, setCmdResult] = useState('');
    function runCmd() {
        dstRunApi({
            url: '/api/server/' + cmd,

            method: 'post',
        }).then((resp) => {
            const ret = resp.data['ret'];
            const detail = resp.data['detail'];
            if (ret !== 0) {
                message.error('run cmd failed: ' + detail);
                return;
            }
            setCmdResult(detail);
        });
    }

    return (
        <Space size="middle" direction="vertical" style={{
            width: "100%",
        }}>
            <h1>Server</h1>
            <div>
                <h2>Status</h2>
                <p>Status: {status}</p>
                <button onClick={refreshStatus}>
                    Get Status
                </button>
            </div>

            <div>
                <h2>Action</h2>
                <Space direction="vertical" size="small">
                    <Button type="primary" size="middle" onClick={() => serveAction("start")}>启动饥荒服务器</Button>
                    <Button type="primary" size="middle" danger onClick={() => serveAction("stop")}>停止饥荒服务器</Button>
                    <Button onClick={() => serveAction("restart")}>重启饥荒服务器</Button>
                    <Button onClick={() => serveAction("update")}>更新饥荒服务器</Button>
                    <Button onClick={() => serveAction("regenerate")}>重新生成饥荒世界</Button>
                </Space>
            </div>

            <div>
                <h2>Player List</h2>
                <Button onClick={listPlayer}>获取在线玩家</Button>
                <List
                    size="small"
                    bordered
                    dataSource={players}
                    renderItem={player => <List.Item>{player}</List.Item>}
                />
            </div>

            <div>
                <h2>Command</h2>
                <div>
                    <h3>Announce</h3>
                    <Input.Group compact>
                        <Input
                            style={{ width: 'calc(100% - 200px)' }}
                            placeholder="消息内容"
                            value={announceMsg}
                            onChange={(e) => setAnnounceMsg(e.target.value)}
                        />
                        <Button type="primary" onClick={serverAnnounce}>发送</Button>
                    </Input.Group>
                </div>
                <div>
                    <h3>Regenerate</h3>
                    <Button type="primary" onClick={serverRegenerate}>重新生成世界</Button>
                </div>
                <div>
                    <h3>Rollback</h3>
                    <Input.Group compact>
                        <Input
                            style={{ width: 'calc(100% - 200px)' }}
                            type="number" placeholder="回档天数"
                            value={rollbackDays}
                            onChange={(e) => setRollbackDays(e.target.value)}
                        />
                        <Button type="primary" onClick={serverRollback}>发送</Button>
                    </Input.Group>
                </div>
                <div>
                    <h3>RunCmd</h3>
                    <Input.Group compact>
                        <Input
                            style={{ width: 'calc(100% - 200px)' }}
                            placeholder="命令"
                            value={cmd}
                            onChange={(e) => setCmd(e.target.value)}
                        />
                        <Button type="primary" onClick={runCmd}>发送</Button>
                        <p>{cmdResult}</p>
                    </Input.Group>
                </div>
            </div>
        </Space>
    );
}