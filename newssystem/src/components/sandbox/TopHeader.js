import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UserOutlined,
} from '@ant-design/icons';
import { Layout, Dropdown, Menu, Avatar } from 'antd';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const { Header } = Layout;

export default function TopHeader() {

    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate()

    const changeCollapsed = () => {
        setCollapsed(!collapsed);
    }

    const onClick = (item) => {
        //console.log(item.key);
        if (item.key * 1 === 2) {
            localStorage.removeItem("token")
            navigate('/login')
        }
    };

    const {role:{roleName}, username} = JSON.parse(localStorage.getItem('token'))

    const menu = (
        <Menu onClick={onClick}
            items={[
                {
                    label: `${roleName}`,
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
                <span> Welcome <span style={{color:'#1890ff'}}>{username}</span> back! </span>
                <Dropdown overlay={menu}>
                    <Avatar size="large" icon={<UserOutlined />} />
                </Dropdown>
            </div>
        </Header>
    )
}
