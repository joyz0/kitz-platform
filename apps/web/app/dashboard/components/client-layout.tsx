'use client';
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
  MenuFoldOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Layout, Menu, theme, Button, Avatar, Dropdown } from 'antd';
import { useRouter } from 'next/navigation';
import ChatBot from '@/components/chat-bot';
import { logout } from '@/actions/login';
import { RoutePath, TOKEN_STORAGE_KEY } from '@/lib/constants';
import { useClientSession } from './client-layout-wrapper';
import { storage } from '@/lib/storage';

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
      { key: RoutePath.DOC_STARTER, label: '快速开始' },
      { key: RoutePath.DOC_INTRO, label: '介绍' },
    ],
  },
  {
    key: '2',
    icon: React.createElement(UserOutlined),
    label: '系统管理',
    children: [
      { key: RoutePath.SYSTEM_USER, label: '用户管理' },
      { key: RoutePath.SYSTEM_INVITE_CODE, label: '邀请码管理' },
    ],
  },
];

const userMenu: MenuProps['items'] = [
  {
    key: '1',
    label: '登出',
  },
];

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const router = useRouter();
  const session = useClientSession();
  const { email, id, image, name, role } = session?.user || {};
  const nickName = name || email || 'User';
  const handleUserMenuClick: MenuProps['onClick'] = (e) => {
    if (e.key === '1') {
      startTransition(async () => {
        storage.remove(TOKEN_STORAGE_KEY);
        await logout();
      });
    }
  };
  const handleMenuClick: MenuProps['onClick'] = (e: any) => {
    router.push(e.key);
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
        <Menu
          theme="dark"
          mode="inline"
          defaultOpenKeys={['1']}
          items={items}
          onClick={handleMenuClick}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 1,
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            padding: 0,
            background: colorBgContainer,
          }}
        >
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
          <div className="flex-1 flex justify-end px-4">
            <Dropdown menu={{ items: userMenu, onClick: handleUserMenuClick }}>
              <a onClick={(e) => e.preventDefault()}>
                <Avatar
                  style={{
                    backgroundColor: '#7265e6',
                    verticalAlign: 'middle',
                  }}
                  size="large"
                >
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
