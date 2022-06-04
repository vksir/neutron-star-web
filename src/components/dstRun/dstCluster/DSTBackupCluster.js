import React, {useState} from "react";
import {dstRunApi} from "../../../common/requests";
import {Input, List, message, Modal, Space} from "antd";

export default function BackupCluster(props) {
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