import {Affix, Layout} from 'antd';
import CustomSider from "../components/Sider";
import React from "react";
import {Outlet} from "react-router-dom";
import HostSelector from "../components/HostSelector";


const {Header, Footer, Sider, Content} = Layout;

export default function Home() {
    const headerHeight = 48;
    const siderWidth = 200;
    return (<Layout>
            {/*header*/}
            <Header style={{
                display: "flex",
                alignItems: "center",
                height: headerHeight,
                color: "#fff",
                padding: "0 40px 0 40px",
                position: 'fixed',
                zIndex: 1,
                width: "100%",
            }}>
                <div style={{fontSize: 18, fontWeight: 600}}>
                    Neutron Star
                </div>
                <div style={{flex: "1 1 0%"}}></div>
                <HostSelector />
                <div style={{fontSize: 14}}>个人中心</div>
            </Header>


            <Layout>
                {/*sider*/}
                <Sider style={{
                    background: "#fff", width: siderWidth,
                }}>
                    <div style={{
                        position: "fixed",
                        top: headerHeight,
                        width: siderWidth,
                    }}>
                        <CustomSider/>
                    </div>
                </Sider>


                {/*content*/}
                <Content style={{
                    padding: "0 0 0 20px", margin: 0, marginTop: headerHeight,
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


        </Layout>);
}

