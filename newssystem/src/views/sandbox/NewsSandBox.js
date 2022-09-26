import React from 'react'
import SideMenu from '../../components/sandbox/SideMenu'
import TopHeader from '../../components/sandbox/TopHeader'
import { Layout } from 'antd'
import './NewSandBox.css'
import NewsRouter from '../../components/sandbox/NewsRouter'
//route loading component
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { useEffect } from 'react'


const { Content } = Layout;

export default function NewsSandBox() {
    NProgress.start()
    
    useEffect(() => {
        NProgress.done()
    })

    return (
        <Layout>
            <SideMenu />
            <Layout className="site-layout">
                <TopHeader />
                <Content
                    className="site-layout-background"
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                        overflow: "auto"
                    }}
                >
                    <NewsRouter />
                </Content>
            </Layout>
        </Layout>
    )
}
