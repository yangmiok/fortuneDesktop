import React, { useState, useEffect } from 'react';
import { Tabs, Card, Typography, Space, Divider } from 'antd';
import { 
  BookOutlined, 
  StarOutlined, 
  ThunderboltOutlined, 
  CompassOutlined, 
  HomeOutlined 
} from '@ant-design/icons';
import { useAppStore } from '../../store';
import './TabPanel.css';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

interface TabPanelProps {
  className?: string;
}

// 标签页配置
const TAB_CONFIG = [
  {
    key: 'bazi',
    label: '四柱八字',
    icon: <BookOutlined />,
    description: '根据出生年月日时推算命理格局'
  },
  {
    key: 'ziwei',
    label: '紫微斗数',
    icon: <StarOutlined />,
    description: '紫微星系命盘分析人生运势'
  },
  {
    key: 'liuyao',
    label: '六爻预测',
    icon: <ThunderboltOutlined />,
    description: '易经六爻卦象预测吉凶'
  },
  {
    key: 'qimen',
    label: '奇门遁甲',
    icon: <CompassOutlined />,
    description: '奇门遁甲时空预测分析'
  },
  {
    key: 'fengshui',
    label: '风水堪舆',
    icon: <HomeOutlined />,
    description: '环境风水布局与调理'
  }
];

const TabPanel: React.FC<TabPanelProps> = ({ className }) => {
  const { 
    ui: { activeTab },
    setActiveTab 
  } = useAppStore();

  // 本地状态管理标签切换
  const [currentTab, setCurrentTab] = useState<string>(activeTab || 'bazi');

  // 同步全局状态
  useEffect(() => {
    if (activeTab && activeTab !== currentTab) {
      setCurrentTab(activeTab);
    }
  }, [activeTab, currentTab]);

  // 处理标签切换
  const handleTabChange = (key: string) => {
    setCurrentTab(key);
    setActiveTab(key);
    
    // 持久化标签状态到本地存储
    try {
      localStorage.setItem('fortune_active_tab', key);
    } catch (error) {
      console.warn('无法保存标签状态到本地存储:', error);
    }
  };

  // 从本地存储恢复标签状态
  useEffect(() => {
    try {
      const savedTab = localStorage.getItem('fortune_active_tab');
      if (savedTab && TAB_CONFIG.find(tab => tab.key === savedTab)) {
        setCurrentTab(savedTab);
        setActiveTab(savedTab);
      }
    } catch (error) {
      console.warn('无法从本地存储读取标签状态:', error);
    }
  }, [setActiveTab]);

  // 渲染标签内容
  const renderTabContent = (tabKey: string) => {
    const tabConfig = TAB_CONFIG.find(tab => tab.key === tabKey);
    
    return (
      <div className="tab-content">
        <div className="tab-header">
          <Space align="center" size="middle">
            <span className="tab-icon">{tabConfig?.icon}</span>
            <div>
              <Title level={3} style={{ margin: 0 }}>
                {tabConfig?.label}
              </Title>
              <Text type="secondary">{tabConfig?.description}</Text>
            </div>
          </Space>
        </div>
        
        <Divider />
        
        <div className="tab-body">
          <Card 
            title="输入信息" 
            className="input-section"
            size="small"
          >
            <div className="form-placeholder">
              <Text type="secondary">
                {tabConfig?.label}计算表单将在此处显示
              </Text>
              <br />
              <Text type="secondary" style={{ fontSize: '12px' }}>
                包含出生信息输入、位置选择等功能
              </Text>
            </div>
          </Card>
          
          <Card 
            title="计算结果" 
            className="result-section"
            size="small"
            style={{ marginTop: '16px' }}
          >
            <div className="result-placeholder">
              <Text type="secondary">
                {tabConfig?.label}计算结果将在此处显示
              </Text>
              <br />
              <Text type="secondary" style={{ fontSize: '12px' }}>
                包含详细分析、图表展示等内容
              </Text>
            </div>
          </Card>
        </div>
      </div>
    );
  };

  return (
    <div className={`tab-panel ${className || ''}`}>
      <Tabs
        activeKey={currentTab}
        onChange={handleTabChange}
        type="card"
        size="large"
        className="fortune-tabs"
        tabPosition="top"
        animated={{ inkBar: true, tabPane: true }}
      >
        {TAB_CONFIG.map(tab => (
          <TabPane
            tab={
              <Space>
                {tab.icon}
                <span>{tab.label}</span>
              </Space>
            }
            key={tab.key}
          >
            {renderTabContent(tab.key)}
          </TabPane>
        ))}
      </Tabs>
    </div>
  );
};

export default TabPanel;