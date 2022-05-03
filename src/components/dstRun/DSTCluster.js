import React, {useEffect, useState} from "react";
import {dstRunApi} from "../../common/requests";
import {Button, Space, message, Spin, List, Tabs, Table, Input, Modal, Drawer} from "antd";

const {TabPane} = Tabs;

export default function DSTCluster() {
    const [backupClusterLoading, setBackupClusterLoading] = useState(true);
    const [templateLoading, setTemplateLoading] = useState(true);
    const loading = backupClusterLoading || templateLoading;
    const [backupClusters, setBackupClusters] = useState([]);
    const [defaultTemplates, setDefaultTemplates] = useState([]);
    const [customTemplates, setCustomTemplates] = useState([]);

    useEffect(() => {
        refreshBackupClusters();
        refreshTemplates();
    }, [])

    function refreshBackupClusters() {
        console.log('refreshBackupClusters');
        dstRunApi({
            url: '/api/backup_cluster',
            method: 'get',
        }).then((resp) => {
            setBackupClusters(resp.data['cluster']['backup_clusters']);
            setBackupClusterLoading(false);
        });
    }

    function refreshTemplates() {
        console.log('refreshTemplates');
        dstRunApi({
            url: '/api/template',
            method: 'get',
        }).then((resp) => {
            setDefaultTemplates(resp.data['cluster']['default_templates']);
            setCustomTemplates(resp.data['cluster']['custom_templates']);
            setTemplateLoading(false);
        });
    }

    return (
        <Spin spinning={loading}>
            <Space direction="vertical" style={{width: "100%"}}>
                <Tabs>
                    <TabPane tab="存档" key="cluster">
                        <Cluster
                            backupClusters={backupClusters}
                            templates={defaultTemplates.concat(customTemplates)}
                        />
                    </TabPane>
                    <TabPane tab="备份存档" key="backup_cluster">
                        <BackupCluster
                            backupClusters={backupClusters}
                            refreshBackupClusters={refreshBackupClusters}
                        />
                    </TabPane>
                    <TabPane tab="存档模板" key="template">
                        <Template
                            defaultTemplates={defaultTemplates}
                            customTemplates={customTemplates}
                            refreshTemplates={refreshTemplates}
                        />
                    </TabPane>
                </Tabs>
            </Space>
        </Spin>
    );
}

function Cluster(props) {
    function createClusterByTemplate(template) {
        dstRunApi({
            url: '/api/cluster/template/' + template,
            method: 'post',
        }).then(() => {
            message.success('创建存档成功');
        });
    }

    function createClusterByBackupCluster(backupCluster) {
        dstRunApi({
            url: '/api/cluster/backup_cluster/' + backupCluster,
            method: 'post',
        }).then(() => {
            message.success('备份存档加载成功');
        });
    }

    return (
        <Space>
            <Button type="primary" danger>创建存档</Button>
            <Button type="primary">备份存档</Button>
            <Button type="primary">存为模板</Button>
        </Space>
    );
}



function BackupCluster(props) {
    const [renameModalVisible, setRenameModalVisible] = useState(false);
    const [newName, setNewName] = useState('');

    function deleteBackupCluster(name) {
        dstRunApi({
            url: '/api/backup_cluster/' + name,
            method: 'delete',
        }).finally(() => {
            props.refreshBackupClusters();
            message.success('删除备份存档成功');
        });
    }

    function renameBackupCluster(name) {
        dstRunApi({
            url: '/api/backup_cluster/' + name,
            method: 'put',
            params: {'new_name': newName},
        }).finally(() => {
            props.refreshBackupClusters();
            message.success('备份存档重命名成功');
        });
    }

    return (
        <List
            bordered={false}
            dataSource={props.backupClusters}
            style={{width: "100%", padding: "0 20px"}}
            renderItem={item => (
                <List.Item>
                    <div>{item}</div>
                    <Space size="large">
                        <div>
                            <a onClick={() => setRenameModalVisible(true)}>重命名</a>
                            <Modal
                                title="重命名"
                                visible={renameModalVisible}
                                onOk={() => {
                                    renameBackupCluster(item);
                                    setRenameModalVisible(false)
                                    setNewName('');
                                }}
                                onCancel={() => {
                                    setRenameModalVisible(false);
                                    setNewName('');
                                }}
                            >
                                <Input value={newName} onChange={(e) => setNewName(e.target.value)}/>
                            </Modal>
                        </div>
                        <div>
                            <a>下载</a>
                        </div>
                        <div>
                            <a onClick={() => deleteBackupCluster(item)}>删除</a>
                        </div>
                    </Space>
                </List.Item>
            )}
        />

    );
}

function Template(props) {
    return (
        <List
            bordered={false}
            dataSource={props.defaultTemplates.concat(props.customTemplates)}
            style={{width: "100%", padding: "0 20px"}}
            renderItem={item => (
                <List.Item>
                    <div>{item}</div>
                    {props.defaultTemplates.includes(item) ?
                        (
                            <Space size="large">
                                <div></div>
                                <div>
                                    <a>下载</a>
                                </div>
                                <div></div>
                            </Space>
                        ) : (
                            <Space size="large">

                                <div>
                                    <a>重命名</a>
                                </div>
                                <div>
                                    <a>下载</a>
                                </div>
                                <div>
                                    <a>删除</a>
                                </div>
                            </Space>
                        )}
                </List.Item>
            )}
        />
    );
}