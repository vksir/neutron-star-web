import React, {useEffect, useState} from "react";
import {Button, Space, message, Input, Select, Descriptions, Tabs, Spin} from "antd";
import {dstRunApi} from "../../common/requests";
import TextArea from "antd/es/input/TextArea";

const {Option} = Select;
const {TabPane} = Tabs;


export default function DSTWorld() {
    const [loading, setLoading] = useState(true);
    const [master, setMaster] = useState('');
    const [caves, setCaves] = useState('');

    useEffect(() => {
        refreshMaster();
        refreshCaves();
    }, []);

    function refreshMaster() {
        console.log('refreshMaster')
        dstRunApi({
            url: '/api/world/master',
            method: 'get',
        }).then((resp) => {
            setMaster(resp.data['world']['master']);
        }).finally(() => {
            setLoading(false);
        });
    }

    function updateMaster() {
        dstRunApi({
            url: '/api/world/master',
            method: 'put',
            data: master,
        }).then(() => {
            message.success('地上世界设置更新成功');
        });
    }

    function refreshCaves() {
        console.log('refreshCaves')
        dstRunApi({
            url: '/api/world/caves',
            method: 'get',
        }).then((resp) => {
            setCaves(resp.data['world']['caves']);
        });
    }

    function updateCaves() {
        dstRunApi({
            url: '/api/world/caves',
            method: 'put',
            data: caves,
        }).then(() => {
            message.success('地下世界设置更新成功');
        });
    }

    return (
        <Spin spinning={loading}>
            <Space size="middle" direction="vertical" style={{
                width: "100%",
            }}>
                <h1>World</h1>

                <Tabs>
                    <TabPane tab="地上世界设置" key="master">
                        <TextArea
                            rows={20}
                            value={master}
                            onChange={(e) => setMaster(e.target.value)}
                        />
                        <div>
                            <br/>
                            <Button type="primary" onClick={updateMaster}>提交</Button>
                        </div>
                    </TabPane>
                    <TabPane tab="地下世界设置" key="caves">
                        <TextArea
                            rows={20}
                            value={caves}
                            onChange={(e) => setCaves(e.target.value)}
                        />
                        <div>
                            <br/>
                            <Button type="primary" onClick={updateCaves}>提交</Button>
                        </div>
                    </TabPane>
                </Tabs>
            </Space>
        </Spin>
    );
}
