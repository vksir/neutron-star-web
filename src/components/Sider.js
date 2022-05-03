import { Menu } from 'antd';
import React from 'react';
import { AppstoreOutlined, MailOutlined } from '@ant-design/icons';
import {Link} from "react-router-dom";

const { SubMenu } = Menu;
const rootSubmenuKeys = ['dst', 'terraria'];

export default function CustomSider() {
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
            <SubMenu key="dst" icon={<MailOutlined />} title="DST Run">
                <Menu.Item key="dst_control">
                    <Link to="/dst/control">启动控制</Link>
                </Menu.Item>
                <Menu.Item key="dst_room">
                    <Link to="/dst/room">房间设置</Link>
                </Menu.Item>
                <SubMenu key="dst_world" title="世界设置">
                    <Menu.Item key="dst_world_master">
                        <Link to="/dst/world/master">地上世界设置</Link>
                    </Menu.Item>
                    <Menu.Item key="dst_world_caves">
                        <Link to="/dst/world/caves">地下世界设置</Link>
                    </Menu.Item>
                </SubMenu>
                <Menu.Item key="dst_mod">
                    <Link to="/dst/mod">Mod 设置</Link>
                </Menu.Item>
                <Menu.Item key="dst_cluster">
                    <Link to="/dst/cluster">存档设置</Link>
                </Menu.Item>
                <Menu.Item key="dst_template">
                    <Link to="/dst/template">模板设置</Link>
                </Menu.Item>
                <Menu.Item key="dst_server">服务器指令</Menu.Item>
            </SubMenu>
            <SubMenu key="terraria" icon={<AppstoreOutlined />} title="Terraria">
                <Menu.Item key="terraria_control">启动控制</Menu.Item>
                <Menu.Item key="terraria_mod">Mod 设置</Menu.Item>
                <Menu.Item key="terraria_cluster">存档设置</Menu.Item>
            </SubMenu>
        </Menu>
    );
};

