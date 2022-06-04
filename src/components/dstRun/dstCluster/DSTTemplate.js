import {List, Space} from "antd";
import React from "react";


export default function Template(props) {
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