import React, {useState} from "react";
import {dstRunApi} from "../../../common/requests";
import {Button, Input, message, Modal, Select, Space} from "antd";

export default function Cluster(props) {
    const [createClusterConfirmModalVisible, setCreateClusterConfirmModalVisible] = useState(false);
    const [createClusterModalVisible, setCreateCLusterModalVisible] = useState(false);
    const [backupClusterModalVisible, setBackupClusterModalVisible] = useState(false);

    function createClusterByBackupCluster(backupClusterName) {
        dstRunApi({
            url: '/api/cluster/backup_cluster/' + backupClusterName,
            method: 'post',
        }).then(() => {
            message.success('备份存档加载成功');
        });
    }

    return (
        <Space>
            <Button type="primary" danger onClick={() => setCreateClusterConfirmModalVisible(true)}>创建存档</Button>
            <Button type="primary" onClick={() => setBackupClusterModalVisible(true)}>备份存档</Button>
            <Button type="primary">存为模板</Button>
            <BackupClusterModal
                backupClusterModalVisible={backupClusterModalVisible}
                setBackupClusterModalVisible={setBackupClusterModalVisible}
                refreshBackupClusters={props.refreshBackupClusters}
            />
            <CreateClusterConfirmModal
                createClusterConfirmModalVisible={createClusterConfirmModalVisible}
                setCreateClusterConfirmModalVisible={setCreateClusterConfirmModalVisible}
                setCreateCLusterModalVisible={setCreateCLusterModalVisible}
            />
            <CreateClusterByTemplateModal
                templates={props.templates}
                createClusterModalVisible={createClusterModalVisible}
                setCreateClusterModalVisible={setCreateCLusterModalVisible}
            />
        </Space>
    );
}

function CreateClusterConfirmModal(props) {
    return (
        <Modal
            title="确认创建存档？"
            visible={props.createClusterConfirmModalVisible}
            onOk={() => {
                props.setCreateCLusterModalVisible(true);
                props.setCreateClusterConfirmModalVisible(false);
            }}
            onCancel={() => {
                props.setCreateClusterConfirmModalVisible(false);
            }}
        >
            创建存档将会覆盖原有存档，请确保原有存档已备份!
        </Modal>
    );
}

function CreateClusterByTemplateModal(props) {
    const [createClusterTargetTemplate, setCreateClusterTargetTemplate] = useState('default');

    function createClusterByTemplate() {
        dstRunApi({
            url: '/api/cluster/template/' + createClusterTargetTemplate,
            method: 'post',
        }).then(() => {
            message.success('创建存档成功');
        });
    }

    return (
        <Modal
            title="创建存档"
            visible={props.createClusterModalVisible}
            onOk={() => {
                createClusterByTemplate();
                props.setCreateClusterModalVisible(false);
            }}
            onCancel={() => {
                props.setCreateClusterModalVisible(false);
            }}
        >
            <p>请选择创建存档使用的模板:</p>
            <TemplateSelector
                templates={props.templates}
                createClusterTargetTemplate={createClusterTargetTemplate}
                setCreateClusterTargetTemplate={setCreateClusterTargetTemplate}
            />
        </Modal>
    );
}

function TemplateSelector(props) {
    const listTemplates = props.templates.map((template) =>
        <Select.Option key={template} value={template}>{template}</Select.Option>
    );

    return (
        <Select
            value={props.createClusterTargetTemplate}
            onChange={props.setCreateClusterTargetTemplate}
        >
            {listTemplates}
        </Select>
    );
}


function BackupClusterModal(props) {
    const [backupClusterName, setBackupClusterName] = useState('');

    function createClusterByBackupCluster() {
        dstRunApi({
            url: '/api/backup_cluster/' + backupClusterName,
            method: 'post',
        }).then(() => {
            props.refreshBackupClusters();
            message.success('备份存档成功');
        });
    }

    return (
        <Modal
            title="备份存档"
            visible={props.backupClusterModalVisible}
            onOk={() => {
                createClusterByBackupCluster();
                props.setBackupClusterModalVisible(false);
            }}
            onCancel={() => {
                props.setBackupClusterModalVisible(false);
            }}
        >
            <p>请输入备份存档文件名称:</p>
            <Input value={backupClusterName} onChange={(e) => setBackupClusterName(e.target.value)}/>
        </Modal>
    );
}