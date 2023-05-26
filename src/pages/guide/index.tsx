import { Local } from "@/common";
import { Form, Input, List } from "antd-mobile";
import { UnorderedListOutline } from "antd-mobile-icons";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Guide = () => {
  const history = useNavigate();
  const [token, tokenSet] = useState<string>(Local("token") || "");
  const [udid, udidSet] = useState<string>(Local("finger") || "");
  const route = [
    { name: "赛车", url: "/saiche" },
    { name: "骰宝", url: "/toubao" },
    { name: "番摊", url: "/xocdia" },
    { name: "快三", url: "/jsks" },
    { name: "鱼虾蟹", url: "/yuxx" },
    { name: "彩票(fast 5d)", url: "/txssc" },
    { name: "pk10", url: "/pk10" },
    { name: "幸运飞艇", url: "/xyft" },
    { name: "六合彩(mark six)", url: "/yflhc" },
  ];
  return (
    <div style={{ padding: 20, overflowY: "scroll", height: "100vh" }}>
      <Form layout="horizontal">
        <Form.Header>必传参数</Form.Header>
        <Form.Item label="token">
          <Input placeholder="输入token" value={token} onChange={tokenSet} clearable />
        </Form.Item>
        <Form.Item label="udid">
          <Input placeholder="输入udid" value={udid} onChange={udidSet} clearable />
        </Form.Item>
      </Form>
      <List header="游戏列表">
        {route.map((item, index) => {
          return (
            <List.Item
              key={index}
              prefix={<UnorderedListOutline />}
              onClick={() => {
                Local("token", token);
                Local("finger", udid);
                history(item.url);
              }}>
              {item.name}
            </List.Item>
          );
        })}
      </List>
    </div>
  );
};

export default Guide;
