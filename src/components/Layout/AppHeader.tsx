import React from 'react';
import { Layout, Typography, Button, Space } from 'antd';
import {
  QuestionCircleOutlined,
  HistoryOutlined,
  TeamOutlined
} from '@ant-design/icons';
import { APP_INFO, HEADER_BUTTONS } from '../../constants';
import './AppHeader.css';

const { Header } = Layout;
const { Title, Text } = Typography;

interface AppHeaderProps {
  sidebarCollapsed?: boolean;
  onToggleSidebar?: () => void;
  onButtonClick?: (key: string) => void;
}

const iconMap = {
  'question-circle': <QuestionCircleOutlined />,
  'history': <HistoryOutlined />,
  'team': <TeamOutlined />
};

const AppHeader: React.FC<AppHeaderProps> = ({
  sidebarCollapsed = false,
  onToggleSidebar,
  onButtonClick
}) => {
  const handleButtonClick = (key: string) => {
    onButtonClick?.(key);
  };

  return (
    <Header className="app-header">
      <div className="header-left">
        <button
          type="button"
          className="brand-mark"
          onClick={onToggleSidebar}
          aria-label={sidebarCollapsed ? '展开侧边栏' : '收起侧边栏'}
        >
          <span className="brand-mark-ring" />
          <span className="brand-mark-dot" />
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
      
      <div className="header-right">
        <Space size="middle">
          {HEADER_BUTTONS.map(button => (
            <Button
              key={button.key}
              type={button.key === 'business' ? 'default' : 'text'}
              icon={iconMap[button.icon as keyof typeof iconMap]}
              onClick={() => handleButtonClick(button.key)}
              className={`header-button ${button.key === 'business' ? 'header-button-primary' : ''}`}
            >
              <span className="button-text">{button.label}</span>
            </Button>
          ))}
        </Space>
      </div>
    </Header>
  );
};

export default AppHeader;
