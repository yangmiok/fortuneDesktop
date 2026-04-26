import React from 'react';
import { Layout, Menu, Button } from 'antd';
import {
  LeftOutlined,
  RightOutlined,
  HomeOutlined,
  AppstoreOutlined,
  StarOutlined,
  AlignLeftOutlined,
  CompassOutlined,
  BorderOutlined,
  TeamOutlined
} from '@ant-design/icons';
import { NAVIGATION_ITEMS } from '../../constants';
import './AppSidebar.css';

const { Sider } = Layout;

interface AppSidebarProps {
  collapsed: boolean;
  activeKey: string;
  onSelect?: (key: string) => void;
  onToggle?: () => void;
}

const iconMap = {
  home: <HomeOutlined />,
  calendar: <AppstoreOutlined />,
  star: <StarOutlined />,
  thunderbolt: <AlignLeftOutlined />,
  compass: <CompassOutlined />,
  environment: <BorderOutlined />,
  team: <TeamOutlined />
};

const AppSidebar: React.FC<AppSidebarProps> = ({
  collapsed,
  activeKey,
  onSelect,
  onToggle
}) => {
  const menuItems = NAVIGATION_ITEMS.map(item => ({
    key: item.key,
    icon: iconMap[item.icon as keyof typeof iconMap],
    label: item.label
  }));

  const handleMenuClick = ({ key }: { key: string }) => {
    onSelect?.(key);
  };

  return (
    <Sider 
      trigger={null} 
      collapsible 
      collapsed={collapsed}
      className="app-sidebar"
      width={240}
      collapsedWidth={88}
      theme="light"
    >
      <div className="sidebar-content">
        <div className="sidebar-toolbar">
          {!collapsed && <div className="sidebar-toolbar-title">导航</div>}
          <button
            type="button"
            className="sidebar-collapse-button"
            onClick={onToggle}
            aria-label={collapsed ? '展开菜单栏' : '折叠菜单栏'}
            title={collapsed ? '展开菜单栏' : '折叠菜单栏'}
          >
            {collapsed ? <RightOutlined /> : <LeftOutlined />}
          </button>
        </div>

        <div className="sidebar-nav-group">
          <div className="sidebar-section-label">功能导航</div>
          <Menu
            mode="inline"
            selectedKeys={[activeKey]}
            items={menuItems}
            onClick={handleMenuClick}
            className="sidebar-menu"
          />
        </div>

        {!collapsed && (
          <div className="sidebar-business-card">
            <div className="sidebar-business-icon">
              <TeamOutlined />
            </div>
            <div className="sidebar-business-label">尊享服务</div>
            <div className="sidebar-business-title">商务合作</div>
            <div className="sidebar-business-copy">专属顾问 · 定制接入</div>
            <Button className="sidebar-business-button">立即联系</Button>
          </div>
        )}

        <div className="sidebar-footer-note">信息仅用于测算，严格保密</div>
      </div>
    </Sider>
  );
};

export default AppSidebar;
