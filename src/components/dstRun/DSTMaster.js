import React, {useEffect, useState} from "react";
import {Button, Space, message, Input, Select, Descriptions} from "antd";
import {dstRunApi} from "../../common/requests";
import TextArea from "antd/es/input/TextArea";

const {Option} = Select;


export default function DSTMaster() {
    const [loading, setLoading] = useState(true);
    const [master, setMaster] = useState({});

    useEffect(() => {
        refreshMaster();
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

    return (
        <Space size="middle" direction="vertical" style={{
            width: "100%",
        }}>
            <h1>Master</h1>
            <div>
                <MultipleWorldOptions
                    world={master}
                    setWorld={setMaster}
                    title="全局"
                    options={[
                        {
                            "title": "活动",
                            "keyword": "specialevent",
                            "options": specialEvent,
                        },
                    ]}
                />
                <MultipleWorldOptions
                    world={master}
                    setWorld={setMaster}
                    title="活动"
                    options={[
                        {"title": "盛夏鸦年华", "keyword": "crow_carnival", "options": specialEventEnable},
                        {
                            "title": "万圣夜",
                            "keyword": "hallowed_nights",
                            "options": specialEventEnable,
                        },
                        {
                            "title": "冬季盛宴",
                            "keyword": "winters_feast",
                            "options": specialEventEnable,
                        },
                        {
                            "title": "火鸡之年",
                            "keyword": "year_of_the_varg",
                            "options": specialEventEnable,
                        },
                        {
                            "title": "座狼之年",
                            "keyword": "year_of_the_gobbler",
                            "options": specialEventEnable,
                        },
                        {
                            "title": "猪王之年",
                            "keyword": "year_of_the_pig",
                            "options": specialEventEnable,
                        },
                        {
                            "title": "胡萝卜鼠之年",
                            "keyword": "year_of_the_carrat",
                            "options": specialEventEnable,
                        },
                        {
                            "title": "皮弗娄牛之年",
                            "keyword": "year_of_the_beefalo",
                            "options": specialEventEnable,
                        },
                        {
                            "title": "浣猫之年",
                            "keyword": "year_of_the_catcoon",
                            "options": specialEventEnable,
                        },
                    ]}
                />
                <MultipleWorldOptions
                    world={master}
                    setWorld={setMaster}
                    title="世界"
                    options={[
                        {
                            "title": "雨",
                            "keyword": "weather",
                            "options": frequency,
                        },
                        {
                            "title": "狩猎",
                            "keyword": "hunt",
                            "options": frequency,
                        },
                        {
                            "title": "野火",
                            "keyword": "wildfires",
                            "options": frequency,
                        },
                        {
                            "title": "闪电",
                            "keyword": "lightning",
                            "options": frequency,
                        },
                        {
                            "title": "青蛙雨",
                            "keyword": "frograin",
                            "options": frequency,
                        },
                        {
                            "title": "森林石化",
                            "keyword": "petrification",
                            "options": frequency,
                        },
                        {
                            "title": "流星频率",
                            "keyword": "meteorshowers",
                            "options": frequency,
                        },
                        {
                            "title": "猎犬袭击",
                            "keyword": "hounds",
                            "options": frequency,
                        },
                        {
                            "title": "追猎惊喜",
                            "keyword": "alternatehunt",
                            "options": frequency,
                        },
                    ]}
                />
                <Button type="primary" onClick={updateMaster}>提交</Button>
            </div>
        </Space>
    );
}

function MultipleWorldOptions(props) {
    const worldOptionList = props.options.map(item => (
            <Descriptions.Item key={item.keyword} label={item.title}>
                <Select
                    value={props.world[item.keyword]}
                    onChange={(value) => {
                        props.setWorld({
                            ...props.world,
                            [item.keyword]: value
                        })
                    }}
                    bordered={false}
                    style={{width: "100%"}}
                >
                    {item.options.map(item => (
                        <Option key={item.value} value={item.value}>
                            {item.title}
                        </Option>
                    ))}
                </Select>
            </Descriptions.Item>
    ));
    return (
        <div>
            <h2>{props.title}</h2>
            <Descriptions column={3} bordered size="small">
                {worldOptionList}
            </Descriptions>
        </div>
    );
}


const frequency = [
    {"title": "", "value": "never"},
    {"title": "", "value": "rare"},
    {"title": "", "value": "default"},
    {"title": "", "value": "often"},
    {"title": "x", "value": "always"},
];
const rate = [
    {"title": "", "value": "never"},
    {"title": "", "value": "veryslow"},
    {"title": "", "value": "slow"},
    {"title": "", "value": "default"},
    {"title": "", "value": "fast"},
    {"title": "", "value": "veryfast"},
];
const rarity = [
    {"title": "", "value": "never"},
    {"title": "", "value": "rare"},
    {"title": "", "value": "uncommon"},
    {"title": "", "value": "default"},
    {"title": "", "value": "often"},
    {"title": "", "value": "mostly"},
    {"title": "", "value": "always"},
    {"title": "", "value": "insane"},
];
const specialEvent = [
    {"title": "无", "value": "none"},
    {"title": "自动", "value": "default"},
];
const specialEventEnable = [
    {"title": "默认", "value": "default"},
    {"title": "总是", "value": "enabled"},
];
const taskSet = [
    {"title": "", "value": "classic"},
    {"title": "", "value": "default"},
    {"title": "", "value": "cave_default"},
];
const worldSize = [
    {"title": "", "value": "small"},
    {"title": "", "value": "medium"},
    {"title": "", "value": "default"},
    {"title": "", "value": "huge"},
];
const prefabSwapsStart = [
    {"title": "", "value": "classic"},
    {"title": "", "value": "default"},
    {"title": "", "value": "highly random"},
];