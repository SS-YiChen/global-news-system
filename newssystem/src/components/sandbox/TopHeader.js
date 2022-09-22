import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UserOutlined,
} from '@ant-design/icons';
import { Layout, Dropdown, Menu, Avatar } from 'antd';
import React, { useState } from 'react';
const { Header } = Layout;

export default function TopHeader() {

    const [collapsed, setCollapsed] = useState(false);

    const changeCollapsed = () => {
        setCollapsed(!collapsed);
    }

    const menu = (
        <Menu
            items={[
                {
                    label: 'Administrator',
                    key: '1',
                },
                {
                    label: 'Exit',
                    key: '2',
                    danger: true,
                },
            ]}
        />
    );

    return (
        <Header
            className="site-layout-background"
            style={{
                padding: 0,
            }}
        >
            {
                collapsed ?
                    <MenuUnfoldOutlined onClick={changeCollapsed} /> : <MenuFoldOutlined onClick={changeCollapsed} />
            }

            <div style={{ float: 'right' }}>
                <span>Welcome xxx back!</span>
                <Dropdown overlay={menu}>
                <Avatar size="large" icon={<UserOutlined />} />
                </Dropdown>
            </div>
        </Header>
    )
}
