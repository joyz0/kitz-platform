"use client";
import React, { useState, startTransition } from 'react';
import {
  AppstoreOutlined,
  BarChartOutlined,
  CloudOutlined,
  ShopOutlined,
  TeamOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Layout, Menu, theme, Button, Avatar, Dropdown } from 'antd';
import { useRouter } from 'next/navigation'
import ChatBot from "@/components/chat-bot";
import { logout } from '@/actions/login';
import { RoutePath } from '@/lib/constants';

const { Header, Content, Footer, Sider } = Layout;

const siderStyle: React.CSSProperties = {
  overflow: 'auto',
  height: '100vh',
  position: 'sticky',
  insetInlineStart: 0,
  top: 0,
  bottom: 0,
  scrollbarWidth: 'thin',
  scrollbarGutter: 'stable',
};

const items: any[] = [
    {
        key: '1',
        icon: React.createElement(UserOutlined),
        label: '如何使用',
        children: [
            { key: '11', label: '快速开始', url: RoutePath.DOC_STARTER },
            { key: '12', label: '介绍', url: RoutePath.DOC_INTRO },
          ]
    },
    {
        key: '2',
        icon: React.createElement(UserOutlined),
        label: '系统管理',
        children: [
            { key: '21', label: '用户管理', url: RoutePath.SYSTEM_USER },
            { key: '22', label: '邀请码管理', url: RoutePath.SYSTEM_INVITE_CODE },
          ]
    }
]

const userMenu: MenuProps['items'] = [
    {
      key: '1',
      label: '登出',
    },
];

export default function ClientLayout({
  children,
  session
}: Readonly<{
  children: React.ReactNode;
  session: any
}>) {
    const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const router = useRouter();
  const { email, id, image, name, role } = session?.user || {};
  const nickName = name || email || 'User';
  const handleUserMenuClick: MenuProps['onClick'] = (e) => {
    if (e.key === '1') {
        startTransition(async () => {
            await logout();
          });
    }
  };
  const handleMenuClick: MenuProps['onClick'] = (e: any) => {
    if (e.item.props.url) {
        router.push(e.item.props.url);
    }
  };

  return (
    <Layout hasSider>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={siderStyle}
      >
        <div className="demo-logo-vertical" />
        <Menu theme="dark" mode="inline" defaultOpenKeys={['1']} items={items} onClick={handleMenuClick}/>
      </Sider>
      <Layout>
        <Header style={{ position: 'sticky', top: 0, zIndex: 1, width: '100%', display: 'flex', alignItems: 'center', padding: 0, background: colorBgContainer }}>
            <div className="flex-0">
                <Button
                    type="text"
                    icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                    onClick={() => setCollapsed(!collapsed)}
                    style={{
                        fontSize: '16px',
                        width: 64,
                        height: 64,
                    }}
                />
            </div>
            <div className='flex-1 flex justify-end px-4'>
            <Dropdown menu={{ items: userMenu, onClick: handleUserMenuClick }}>
                <a onClick={(e) => e.preventDefault()}>
                    <Avatar style={{ backgroundColor: '#7265e6', verticalAlign: 'middle' }} size="large">
                        {nickName.slice(0, 5)}
                    </Avatar>
                </a>
            </Dropdown>
            </div>
        </Header>
        <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
            <div
                style={{
                    padding: 24,
                    textAlign: 'center',
                    background: colorBgContainer,
                    borderRadius: borderRadiusLG,
                }}
            >
                {children}
            </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          Kitz Platform ©{new Date().getFullYear()} Created by joyz0
          <ChatBot />
        </Footer>
      </Layout>
    </Layout>
  );
}
