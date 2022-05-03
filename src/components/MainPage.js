import {Affix, Col, Layout, Menu, Row, Select, Space} from 'antd';
import React, {useEffect, useState} from "react";
import {Link, Outlet} from "react-router-dom";
import {neutronServerApi} from "../common/requests";
import {getHostNickname, setHostNickname, setHostUUID} from "../common/utils";
import {AppstoreOutlined, MailOutlined} from "@ant-design/icons";

const {Header, Footer, Sider, Content} = Layout;


export default function MainPage() {
    const headerHeight = '48px';
    const siderWidth = '200px';
    return (
        <Layout>
            <Header style={{
                padding: "0 40px",
                position: 'fixed',
                zIndex: 1,
                width: "100%",
                height: headerHeight,
                lineHeight: headerHeight,
            }}>
                <Row>
                    <Col span={12}>
                        <Space>
                            <span style={{fontSize: 18, fontWeight: 600, color: "#fff"}}>Neutron Star</span>
                        </Space>
                    </Col>
                    <Col span={12} style={{display: "flex", justifyContent: "flex-end"}}>
                        <Space size="large">
                            <HostSelect/>
                            <div style={{fontSize: 14, color: "#fff"}}>个人中心</div>
                        </Space>
                    </Col>
                </Row>
            </Header>

            <Layout>
                <Sider style={{
                    position: "fixed",
                    top: headerHeight,
                    height: "100%",
                    background: "#fff",
                }}>
                    <MainMenu/>
                </Sider>

                <Content style={{
                    paddingLeft: 10,
                    marginTop: headerHeight,
                    marginLeft: siderWidth,
                }}>
                    <div style={{height: "100%"}}>
                        <div style={{padding: 20, background: "#fff"}}>
                            <Outlet/>
                        </div>

                        {/*footer*/}
                        <div style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            height: headerHeight,
                            background: "#f0f2f5",
                        }}>
                            <div>By Villkiss</div>
                        </div>
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
}


function HostSelect() {
    const [hosts, setHosts] = useState([]);
    const listHosts = hosts.map((host) =>
        <Select.Option key={host['uuid']} value={host['uuid']}>{host['nickname']}</Select.Option>
    );

    useEffect(() => {
        getHosts();
    }, [])

    function getHosts() {
        neutronServerApi({
            url: '/host',
            method: 'get',
        }).then((resp) => {
            setHosts(resp.data);
        });
    }

    function handleHostChange(uuid) {
        setHostUUID(uuid);
        for (let i = 0; i < hosts.length; i++) {
            if (hosts[i]['uuid'] === uuid) {
                setHostNickname(hosts[i]['nickname']);
            }
        }
        window.location.reload();
    }

    return (
        <Select
            defaultValue={getHostNickname()}
            onChange={handleHostChange}
            style={{width: 120}}
        >
            {listHosts}
        </Select>
    );
}


const {SubMenu} = Menu;
const rootSubmenuKeys = ['dst', 'terraria'];

function MainMenu() {
    const [openKeys, setOpenKeys] = React.useState(['dst']);

    const onOpenChange = keys => {
        const latestOpenKey = keys.find(key => openKeys.indexOf(key) === -1);
        if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
            setOpenKeys(keys);
        } else {
            setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
        }
    };

    return (
        <Menu
            mode="inline"
            openKeys={openKeys}
            onOpenChange={onOpenChange}
            theme="light"
        >
            <SubMenu key="dst" icon={<MailOutlined/>} title="DST Run">
                <Menu.Item key="dst_control">
                    <Link to="/dst/control">启动控制</Link>
                </Menu.Item>
                <Menu.Item key="dst_room">
                    <Link to="/dst/room">房间设置</Link>
                </Menu.Item>
                <Menu.Item key="dst_world">
                    <Link to="/dst/world">世界设置</Link>
                </Menu.Item>
                <Menu.Item key="dst_mod">
                    <Link to="/dst/mod">Mod 设置</Link>
                </Menu.Item>
                <Menu.Item key="dst_cluster">
                    <Link to="/dst/cluster">存档设置</Link>
                </Menu.Item>
            </SubMenu>
            <SubMenu key="terraria" icon={<AppstoreOutlined/>} title="Terraria">
                <Menu.Item key="terraria_control">启动控制</Menu.Item>
                <Menu.Item key="terraria_mod">Mod 设置</Menu.Item>
                <Menu.Item key="terraria_cluster">存档设置</Menu.Item>
            </SubMenu>
        </Menu>
    );
}

