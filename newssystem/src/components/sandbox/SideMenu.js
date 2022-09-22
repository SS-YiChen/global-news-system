import {
    UploadOutlined,
    UserOutlined,
    VideoCameraOutlined,
} from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import SubMenu from 'antd/lib/menu/SubMenu';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation} from 'react-router-dom';

import './index.css'

const { Sider } = Layout;

// const menuList = [
//     {
//         key: '/home',
//         title: 'Home',
//         icon: <UserOutlined />,
//     },
//     {
//         key: '/user-manage',
//         title: 'User Management',
//         icon: <UserOutlined />,
//         children: [
//             {
//                 key: '/user-manage/list',
//                 title: 'User Lists',
//                 icon: <UserOutlined />,
//             },
//         ],
//     },
//     {
//         key: '/right-manage',
//         title: 'Right Management',
//         icon: <UserOutlined />,
//         children: [
//             {
//                 key: '/right-manage/role/list',
//                 title: 'Role Lists',
//                 icon: <UserOutlined />,
//             },
//             {
//                 key: '/right-manage/right/list',
//                 title: 'Right Lists',
//                 icon: <UserOutlined />,
//             },
//         ],
//     },
// ]

const iconList = {
    "/home": < UserOutlined />,
    "/user-manage": < UserOutlined />,
    "/user-manage/list": < UploadOutlined />,
    "/right-manage/role/list": < VideoCameraOutlined />,
    "/right-manage/right/list": < VideoCameraOutlined />,
}

export default function SideMenu() {

    const [collapsed, setCollapsed] = useState(false)
    const [menu, setMenu] = useState([])

    const navigate = useNavigate();
    const location = useLocation();

    useEffect( ()=> {
        axios.get("http://localhost:5000/rights?_embed=children")
                .then( res => {
                    //console.log(res.data)
                    setMenu(res.data)
                })
    }, [])

    const checkPagePermission = item => {
        return item.pagepermisson
    }

    const renderMenu = (menuList) => {
        return menuList.map(item => {
            if (item.children?.length >0 && checkPagePermission(item)) {
                return (
                    <SubMenu key={item.key} icon={iconList[item.key]} title={item.title}>
                        {renderMenu(item.children)}
                    </SubMenu>
                )
            }
            return checkPagePermission(item) && (
                <Menu.Item key={item.key} icon={iconList[item.key]} onClick={()=> {
                    navigate(`${item.key}`)
                }} >
                    {item.title}
                </Menu.Item>
            )
        })
    }

    //console.log(location)
    // set the hightlight picked item on the menu
    const selectKeys =[location.pathname]
    const openKeys = ["/" + location.pathname.split("/")[1]]

    return (
        <Sider trigger={null} collapsible collapsed={false} >
            <div style={{display:"flex", height:"100%", flexDirection: "column "}}>
            <div className="logo">Global News Release Management</div>
            <div style={{flex:1, overflow:"auto"}}>
            <Menu
                theme="dark"
                mode="inline"
                defaultSelectedKeys={selectKeys}
                defaultOpenKeys={openKeys}
            >
                {renderMenu(menu)}
            </Menu>
            </div>
            </div>
        </Sider>
    )
}
