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
            message.success('?????? Mod ????????????');
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
            message.success('?????? Mod ??????');
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
                    ?????? Mod
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
                    ?????? Mod
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
                    ?????? Mod ??????
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
                    ?????? Mod
                </Button>
                <div style={{marginRight: 8}}>
                    {hasSelected ? `????????? ${selectedModIds.length} ??? Mod` : ''}
                </div>
                <Button
                    type="primary"
                    style={{marginLeft: "auto", justifyContent: "flex-end"}}
                    onClick={() => props.setAddModsDrawerVisible(true)}
                >
                    ?????? Mod
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
            message.success('?????? Mod ??????');
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
            title="?????? Mod"
            placement="right"
            onClose={close}
            visible={props.visible}
            width="50%"
        >
            <div>
                <h2>Mod ID</h2>
                <Input
                    placeholder="???????????? Mod ID, ?????????????????????"
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
                    placeholder="?????? modoverrides.lua ????????????"
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
                <Button type="primary" style={{marginRight: 8}} onClick={addMods}>??????</Button>
                <Button onClick={close}>??????</Button>
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
            message.success('?????? Mod ????????????');
            close();
        });
    }

    function close() {
        props.setVisible(false);
    }

    return (
        <Drawer
            title="Mod ??????"
            placement="right"
            onClose={close}
            visible={props.visible}
            width="50%"
        >
            <div>
                <Descriptions column={2} bordered size="small">
                    <Descriptions.Item label="??????">{mod.name}</Descriptions.Item>
                    <Descriptions.Item label="??????">
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
                    <Descriptions.Item label="??????">{mod.version}</Descriptions.Item>
                    <Descriptions.Item label="??????">
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
                <Button type="primary" style={{marginRight: 8}} onClick={updateMod}>??????</Button>
                <Button onClick={close}>??????</Button>
            </div>
        </Drawer>
    );
}