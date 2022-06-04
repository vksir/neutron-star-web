import React, {useEffect, useState} from "react";
import {dstRunApi} from "../../../common/requests";
import {Button, Space, message, Spin, Tabs, Table, Input, Modal, Drawer, Select} from "antd";
import BackupCluster from "./DSTBackupCluster";
import Template from "./DSTTemplate";
import Cluster from "./DSTCurrentCluster";

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
                            refreshBackupClusters={refreshBackupClusters}
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





