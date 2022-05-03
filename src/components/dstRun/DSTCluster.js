import React, {useEffect, useState} from "react";
import {dstRunApi, neutronServerApi} from "../../common/requests";

export default function DSTCluster() {
    function createClusterByTemplate(e) {
        e.preventDefault();
        let formData = new FormData(e.currentTarget);
        let name = formData.get('name');
        dstRunApi({
            url: '/api/cluster/template/' + name,
            method: 'post',
        });
    }

    function createClusterByBackupCluster(e) {
        e.preventDefault();
        let formData = new FormData(e.currentTarget);
        let name = formData.get('name');
        dstRunApi({
            url: '/api/cluster/backup_cluster/' + name,
            method: 'post',
        });
    }

    return (
        <div>
            <div>
                <h1>Cluster</h1>
                <div>
                    <h2>Create Cluster By Template</h2>
                    <form onSubmit={createClusterByTemplate}>
                        <label>
                            TemplateName
                            <input type="text" name="name" />
                        </label>
                        <input type="submit" value="Create" />
                    </form>
                </div>
                <div>
                    <h2>Create Cluster By BackupCluster</h2>
                    <form onSubmit={createClusterByBackupCluster}>
                        <label>
                            BackupClusterName
                            <input type="text" name="name" />
                        </label>
                        <input type="submit" value="Create" />
                    </form>
                </div>
            </div>
        </div>
    );
}