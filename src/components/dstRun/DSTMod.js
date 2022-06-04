import React, {useEffect, useState} from "react";
import {
    Button,
    Space,
    message,
    Input,
    Table,
    Switch,
    Drawer,
    Descriptions,
    Spin,
} from "antd";
import {dstRunApi} from "../../common/requests";
import Column from "antd/lib/table/Column";
import {CheckOutlined, CloseOutlined} from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";


export default function DSTMod() {
    const [loading, setLoading] = useState(true);
    const [mods, setMods] = useState([]);
    const [addModsDrawerVisible, setAddModsDrawerVisible] = useState(false);
    const [updateModDrawerVisible, setUpdateModDrawerVisible] = useState(false);
    const [updateModId, setUpdateModId] = useState('');

    useEffect(() => {
        refreshMods();
    }, []);

    function refreshMods() {
        console.log('refreshMods');
        dstRunApi({
            url: '/api/mod',
            method: 'get',
        }).then((resp) => {
            setMods(resp.data['mods']);
        }).finally(() => {
            setLoading(false);
        });
    }

    return (
        <Spin spinning={loading}>
            <div>
                <ModTable
                    setLoading={setLoading}
                    mods={mods}
                    setAddModsDrawerVisible={setAddModsDrawerVisible}
                    setUpdateModId={(modId) => {
                        setUpdateModId(modId);
                        setUpdateModDrawerVisible(true);
                    }}
                    refreshMods={refreshMods}
                />
                <AddModsDrawer
                    visible={addModsDrawerVisible}
                    setVisible={setAddModsDrawerVisible}
                    refreshMods={refreshMods}
                />
                <UpdateModDrawer
                    modId={updateModId}
                    mods={mods}
                    visible={updateModDrawerVisible}
                    setVisible={setUpdateModDrawerVisible}
                    refreshMods={refreshMods}
                />
            </div>
        </Spin>
    );
}


function ModTable(props) {
    const [selectedModIds, setSelectedModIds] = useState([]);
    const [switchButtonLoading, setSwitchButtonLoading] = useState({});

    const hasSelected = selectedModIds.length > 0;
    const rowSelection = {
        selectedRowKeys: selectedModIds,
        onChange: (selectedRowKeys) => {
            setSelectedModIds(selectedRowKeys)
        },
    };

    function updateModInfos(modIds) {
        const params = new URLSearchParams();
        for (let i = 0; i < modIds.length; i++) {
            params.append('mod_id', modIds[i]);
        }
        dstRunApi({
            url: '/api/mod/info',
            params: params,
            method: 'post',
        }).then((resp) => {
            props.refreshMods();
            setSelectedModIds([]);
            message.success('更新 Mod 信息成功');
        });
    }

    function deleteMods(modIds) {
        console.log('deleteMods: ', modIds);
        const params = new URLSearchParams();
        for (let i = 0; i < modIds.length; i++) {
            params.append('mod_id', modIds[i]);
        }
        dstRunApi({
            url: '/api/mod',
            params: params,
            method: 'delete',
        }).then((resp) => {
            props.refreshMods();
            setSelectedModIds([]);
            message.success('删除 Mod 成功');
        });
    }

    function switchMod(modId, isEnable) {
        dstRunApi({
            url: '/api/mod',
            data: [{
                'id': modId,
                'enable': isEnable,
            }],
            method: 'put',
        }).then(() => {
            props.refreshMods();
        }).finally(() => {
            setSwitchButtonLoading({});
        });
    }

    function switchMods(modIds, isEnable) {
        const data = [];
        for (let i = 0; i < modIds.length; i++) {
            data.push({
                'id': modIds[i],
                'enable': isEnable,
            });
        }
        dstRunApi({
            url: '/api/mod',
            data: data,
            method: 'put',
        }).then(() => {
            props.refreshMods();
            setSelectedModIds([])
        });
    }

    return (
        <Space size="small" direction="vertical" style={{
            width: "100%",
        }}>
            <h1>Mod</h1>
            <div style={{display: "flex", alignItems: "center",}}>
                <Button
                    type="primary"
                    style={{marginRight: 8}}
                    onClick={() => {
                        props.setLoading(true);
                        switchMods(selectedModIds, true);
                    }}
                    disabled={!hasSelected}
                >
                    启用 Mod
                </Button>
                <Button
                    type="primary"
                    style={{marginRight: 8}}
                    onClick={() => {
                        props.setLoading(true);
                        switchMods(selectedModIds, false);
                    }}
                    disabled={!hasSelected}
                >
                    停用 Mod
                </Button>
                <Button
                    type="primary"
                    style={{marginRight: 8}}
                    onClick={() => {
                        props.setLoading(true);
                        updateModInfos(selectedModIds);
                    }}
                    disabled={!hasSelected}
                >
                    更新 Mod 信息
                </Button>
                <Button
                    type="primary"
                    style={{marginRight: 8}}
                    onClick={() => {
                        props.setLoading(true);
                        deleteMods(selectedModIds);
                    }}
                    disabled={!hasSelected}
                    danger
                >
                    删除 Mod
                </Button>
                <div style={{marginRight: 8}}>
                    {hasSelected ? `已选中 ${selectedModIds.length} 个 Mod` : ''}
                </div>
                <Button
                    type="primary"
                    style={{marginLeft: "auto", justifyContent: "flex-end"}}
                    onClick={() => props.setAddModsDrawerVisible(true)}
                >
                    添加 Mod
                </Button>

            </div>
            <Table rowSelection={rowSelection} dataSource={props.mods} rowKey="id">
                <Column
                    title="Name"
                    dataIndex="name"
                    render={(text, record) => (
                        // eslint-disable-next-line jsx-a11y/anchor-is-valid
                        <a onClick={() => {
                            props.setUpdateModId(record.id);
                        }}>
                            {record.name}
                        </a>
                    )}
                />
                <Column title="ID" dataIndex="id"/>
                <Column title="Remark" dataIndex="remark"/>
                <Column
                    title="Enable"
                    dataIndex="enable"
                    filters={[
                        {
                            text: 'Enable',
                            value: 'true',
                        },
                        {
                            text: 'Disable',
                            value: 'false',
                        }
                    ]}
                    onFilter={(value, record) => record.enable.toString() === value}
                    sorter={(a, b) => -a.enable + b.enable}
                    defaultSortOrder="ascend"
                    render={(text, record) => (
                        <Switch
                            checkedChildren={<CheckOutlined/>}
                            unCheckedChildren={<CloseOutlined/>}
                            checked={record.enable}
                            loading={switchButtonLoading[record.id]}
                            onChange={checked => {
                                setSwitchButtonLoading({[record.id]: true});
                                switchMod(record.id, checked);
                            }}
                        />
                    )}
                />
            </Table>
        </Space>
    );
}


function AddModsDrawer(props) {
    const [modIdContent, setModIdContent] = useState('');
    const [modFileContent, setModFileContent] = useState('');

    function addMods() {
        const modIds = modIdContent.split(',').filter(item => item !== '');
        console.log('addMods, modIds: ', modIds, ', modContent: ', modFileContent);
        const params = new URLSearchParams();
        for (let i = 0; i < modIds.length; i++) {
            params.append('mod_id', modIds[i]);
        }
        dstRunApi({
            url: '/api/mod',
            params: params,
            data: modFileContent,
            method: 'post',
        }).then(() => {
            props.refreshMods();
            message.success('添加 Mod 成功');
            close();
        });
    }

    function close() {
        props.setVisible(false)
        setModIdContent('');
        setModFileContent('');
    }

    return (
        <Drawer
            title="添加 Mod"
            placement="right"
            onClose={close}
            visible={props.visible}
            width="50%"
        >
            <div>
                <h2>Mod ID</h2>
                <Input
                    placeholder="输入多个 Mod ID, 中间以逗号隔开"
                    value={modIdContent}
                    onChange={(e) => {
                        setModIdContent(e.target.value.replace(/[^\d,]/g, ''));
                    }}
                />
            </div>
            <div>
                <h2>Content</h2>
                <TextArea
                    rows={20}
                    placeholder="输入 modoverrides.lua 文件内容"
                    style={{
                        resize: "none",
                    }}
                    value={modFileContent}
                    onChange={(e) => {
                        setModFileContent(e.target.value);
                    }}
                />
            </div>
            <div>
                <br/>
                <Button type="primary" style={{marginRight: 8}} onClick={addMods}>提交</Button>
                <Button onClick={close}>取消</Button>
            </div>
        </Drawer>
    );
}


function UpdateModDrawer(props) {
    const [mod, setMod] = useState({});

    useEffect(() => {
        if (props.modId) {
            for (let i = 0; i < props.mods.length; i++) {
                if (props.mods[i].id === props.modId) {
                    setMod(props.mods[i]);
                }
            }
        }
    }, [props.mods, props.modId])

    function updateMod() {
        dstRunApi({
            url: '/api/mod',
            data: [
                {
                    'id': mod.id,
                    'remark': mod.remark,
                    'config': mod.config,
                }
            ],
            method: 'put',
        }).then(() => {
            props.refreshMods();
            message.success('更新 Mod 信息成功');
            close();
        });
    }

    function close() {
        props.setVisible(false);
    }

    return (
        <Drawer
            title="Mod 配置"
            placement="right"
            onClose={close}
            visible={props.visible}
            width="50%"
        >
            <div>
                <Descriptions column={2} bordered size="small">
                    <Descriptions.Item label="名称">{mod.name}</Descriptions.Item>
                    <Descriptions.Item label="别名">
                        <Input
                            value={mod.remark}
                            onChange={(e) => {
                                setMod({
                                    ...mod,
                                    'remark': e.target.value,
                                })
                            }}
                        />
                    </Descriptions.Item>
                    <Descriptions.Item label="ID">{mod.id}</Descriptions.Item>
                    <Descriptions.Item label="版本">{mod.version}</Descriptions.Item>
                    <Descriptions.Item label="配置">
                        <TextArea
                            rows={20}
                            style={{
                                resize: "none",
                            }}
                            value={mod.config}
                            onChange={(e) => {
                                setMod({
                                    ...mod,
                                    'config': e.target.value,
                                })
                            }}
                        />
                    </Descriptions.Item>
                </Descriptions>

            </div>
            <div>
                <br/>
                <Button type="primary" style={{marginRight: 8}} onClick={updateMod}>提交</Button>
                <Button onClick={close}>取消</Button>
            </div>
        </Drawer>
    );
}