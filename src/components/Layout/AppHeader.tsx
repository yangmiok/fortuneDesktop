import React from 'react';
import { Layout, Typography } from 'antd';
import { APP_INFO } from '../../constants';
import logoMark from '../../assets/fortune-logo-mark.svg';
import './AppHeader.css';

const { Header } = Layout;
const { Title, Text } = Typography;

interface AppHeaderProps {
  sidebarCollapsed?: boolean;
  onToggleSidebar?: () => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({
  sidebarCollapsed = false,
  onToggleSidebar
}) => (
    <Header className="app-header">
      <div className="header-left">
        <button
          type="button"
          className="brand-mark"
          onClick={onToggleSidebar}
          aria-label={sidebarCollapsed ? '展开侧边栏' : '收起侧边栏'}
        >
          <img src={logoMark} alt="正统命理标识" className="brand-mark-image" />
        </button>

        <div className="app-branding">
          <Title level={3} className="app-title">
            {APP_INFO.title}
          </Title>
          <Text className="app-subtitle">
            {APP_INFO.subtitle}
          </Text>
        </div>
      </div>
    </Header>
  );

export default AppHeader;
