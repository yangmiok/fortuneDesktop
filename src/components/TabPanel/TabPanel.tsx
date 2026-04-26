import React, { useState, useEffect } from 'react';
import { Button, message } from 'antd';
import {
  BookOutlined,
  StarOutlined,
  ThunderboltOutlined,
  CompassOutlined,
  HomeOutlined
} from '@ant-design/icons';
import { useAppStore } from '../../store';
import { BirthInfo } from '../../types';
import BirthInfoForm from '../Forms/BirthInfoForm';
import LocationInfoForm from '../Forms/LocationInfoForm';
import './TabPanel.css';

interface TabPanelProps {
  className?: string;
}

// 标签页配置
const TAB_CONFIG = [
  {
    key: 'bazi',
    label: '四柱八字',
    icon: <BookOutlined />
  },
  {
    key: 'ziwei',
    label: '紫微斗数',
    icon: <StarOutlined />
  },
  {
    key: 'liuyao',
    label: '六爻预测',
    icon: <ThunderboltOutlined />
  },
  {
    key: 'qimen',
    label: '奇门遁甲',
    icon: <CompassOutlined />
  },
  {
    key: 'fengshui',
    label: '风水堪舆',
    icon: <HomeOutlined />
  }
];

export const TabPanel: React.FC<TabPanelProps> = ({ className }) => {
  const { 
    ui: { activeTab },
    setActiveTab,
    setActiveMenu,
    form: { currentData, validationErrors, isSubmitting },
    updateFormData,
    setValidationErrors,
    submitCalculation
  } = useAppStore();

  const [currentTab, setCurrentTab] = useState<string>(activeTab || 'bazi');

  useEffect(() => {
    if (activeTab && activeTab !== currentTab) {
      setCurrentTab(activeTab);
    }
  }, [activeTab, currentTab]);

  const handleTabChange = (key: string) => {
    setCurrentTab(key);
    setActiveTab(key);
    setActiveMenu(key);

    try {
      localStorage.setItem('fortune_active_tab', key);
    } catch (error) {
      console.warn('无法保存标签状态到本地存储:', error);
    }
  };

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

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!currentData.year) errors.year = '请选择年份';
    if (!currentData.month) errors.month = '请选择月份';
    if (!currentData.day) errors.day = '请选择日期';
    if (currentData.hour === undefined || currentData.hour === null) errors.hour = '请选择时辰';
    if (!currentData.country) errors.country = '请选择国家/地区';
    if (!currentData.province) errors.province = '请选择省份/州';
    if (!currentData.city) errors.city = '请选择城市';

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      message.warning('请先补全测算信息');
      return;
    }

    await submitCalculation(currentTab, currentData as BirthInfo);
    message.success('测算信息已提交');
  };

  return (
    <div className={`tab-panel ${className || ''}`}>
      <div className="fortune-tab-switcher" role="tablist" aria-label="测算类型">
        {TAB_CONFIG.map((tab) => {
          const isActive = tab.key === currentTab;

          return (
            <button
              key={tab.key}
              type="button"
              className={`fortune-tab-switcher-item ${isActive ? 'is-active' : ''}`}
              onClick={() => handleTabChange(tab.key)}
              aria-pressed={isActive}
            >
              <span className="fortune-tab-switcher-icon">{tab.icon}</span>
              <span className="fortune-tab-switcher-text">{tab.label}</span>
            </button>
          );
        })}
      </div>

      <div className="tab-content">
        <div className="fortune-workspace">
          <BirthInfoForm
            value={currentData}
            onChange={updateFormData}
            errors={validationErrors}
          />

          <LocationInfoForm
            value={currentData}
            onChange={updateFormData}
            errors={validationErrors}
          />

          <section className="fortune-section-card fortune-section-card-compact">
            <div className="fortune-section-heading">
              <h3>基本信息</h3>
              <span>仅用于测算</span>
            </div>

            <div className="fortune-submit-wrap">
              <Button
                type="primary"
                className="fortune-submit-button"
                loading={isSubmitting}
                onClick={handleSubmit}
              >
                提交测算
              </Button>
            </div>
          </section>
        </div>

        <footer className="fortune-footer-bar">
          <div className="fortune-footer-note">信息仅用于测算，严格保密</div>
          <div className="fortune-footer-warning">结果仅供参考，理性看待</div>
        </footer>
      </div>
    </div>
  );
};

export default TabPanel;
