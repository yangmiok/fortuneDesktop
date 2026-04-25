import React from 'react';
import { Layout } from 'antd';
import { LayoutProps } from '../../types';
import AppHeader from './AppHeader';
import AppSidebar from './AppSidebar';
import './MainLayout.css';

const { Content } = Layout;

interface MainLayoutProps extends LayoutProps {
  sidebarCollapsed?: boolean;
  onToggleSidebar?: () => void;
  activeMenuItem?: string;
  onMenuSelect?: (key: string) => void;
}

const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  sidebarCollapsed = false,
  onToggleSidebar,
  activeMenuItem = 'home',
  onMenuSelect
}) => {
  return (
    <Layout className="main-layout">
      <AppHeader 
        onToggleSidebar={onToggleSidebar}
        sidebarCollapsed={sidebarCollapsed}
      />
      
      <Layout className="layout-body">
        <AppSidebar
          collapsed={sidebarCollapsed}
          activeKey={activeMenuItem}
          onSelect={onMenuSelect}
        />
        
        <Content className="main-content">
          <div className="content-wrapper">
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;