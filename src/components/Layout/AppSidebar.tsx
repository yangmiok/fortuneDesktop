import React from 'react';
import { Layout, Menu } from 'antd';
import {
  HomeOutlined,
  CalendarOutlined,
  StarOutlined,
  ThunderboltOutlined,
  CompassOutlined,
  EnvironmentOutlined,
  TeamOutlined
} from '@ant-design/icons';
import { NAVIGATION_ITEMS } from '../../constants';
import './AppSidebar.css';

const { Sider } = Layout;

interface AppSidebarProps {
  collapsed: boolean;
  activeKey: string;
  onSelect?: (key: string) => void;
}

const iconMap = {
  home: <HomeOutlined />,
  calendar: <CalendarOutlined />,
  star: <StarOutlined />,
  thunderbolt: <ThunderboltOutlined />,
  compass: <CompassOutlined />,
  environment: <EnvironmentOutlined />,
  team: <TeamOutlined />
};

const AppSidebar: React.FC<AppSidebarProps> = ({
  collapsed,
  activeKey,
  onSelect
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
      collapsedWidth={80}
      theme="light"
    >
      <div className="sidebar-content">
        <Menu
          mode="inline"
          selectedKeys={[activeKey]}
          items={menuItems}
          onClick={handleMenuClick}
          className="sidebar-menu"
        />
      </div>
    </Sider>
  );
};

export default AppSidebar;