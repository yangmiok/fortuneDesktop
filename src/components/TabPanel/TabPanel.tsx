import React, { useState, useEffect } from 'react';
import { Button, message } from 'antd';
import {
  BookOutlined,
  StarOutlined,
  ThunderboltOutlined,
  CompassOutlined,
  HomeOutlined,
  UserOutlined
} from '@ant-design/icons';
import { DEFAULT_CALCULATION_TYPE } from '../../constants';
import { useAppStore } from '../../store';
import { BirthInfo, CalculationType } from '../../types';
import BirthInfoForm from '../Forms/BirthInfoForm';
import FengshuiImageForm from '../Forms/FengshuiImageForm';
import InquiryContentForm from '../Forms/InquiryContentForm';
import LiuyaoForm from '../Forms/LiuyaoForm';
import LocationInfoForm from '../Forms/LocationInfoForm';
import PhysiognomyForm from '../Forms/PhysiognomyForm';
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
  },
  {
    key: 'physiognomy',
    label: '手相面相',
    icon: <UserOutlined />
  }
];

export const TabPanel: React.FC<TabPanelProps> = ({ className }) => {
  const { 
    ui: { activeTab },
    setActiveTab,
    setActiveMenu,
    setCurrentView,
    form: { currentData, validationErrors, isSubmitting },
    updateFormData,
    setValidationErrors,
    submitCalculation
  } = useAppStore();

  const [currentTab, setCurrentTab] = useState<string>(activeTab || DEFAULT_CALCULATION_TYPE);

  useEffect(() => {
    if (activeTab && activeTab !== currentTab) {
      setCurrentTab(activeTab);
    }
  }, [activeTab, currentTab]);

  const handleTabChange = (key: string) => {
    setCurrentTab(key);
    setActiveTab(key);
    setActiveMenu(key);
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (currentTab === 'physiognomy') {
      if (!currentData.physiognomyMode) errors.physiognomyMode = '请选择分析方向';
      if (!currentData.gender) errors.gender = '请选择性别';
      if (!currentData.age) errors.age = '请输入年龄';
      if ((currentData.physiognomyMode === 'palm' || currentData.physiognomyMode === 'both') && !currentData.palmSide) {
        errors.palmSide = '请选择手掌';
      }
      if ((currentData.physiognomyMode === 'palm' || currentData.physiognomyMode === 'both') && !currentData.palmImages?.length) {
        errors.palmImages = '请至少上传一张手掌图片';
      }
      if ((currentData.physiognomyMode === 'face' || currentData.physiognomyMode === 'both') && !currentData.faceImages?.length) {
        errors.faceImages = '请至少上传一张面部图片';
      }
    } else if (currentTab === 'ziwei') {
      if (!currentData.gender) errors.gender = '请选择性别';
      if (!currentData.chartType) errors.chartType = '请选择命盘类型';
      if (!currentData.calendarType) errors.calendarType = '请选择历法';
      if (!currentData.year) errors.year = '请选择年份';
      if (!currentData.month) errors.month = '请选择月份';
      if (!currentData.day) errors.day = '请选择日期';
      if (currentData.hour === undefined || currentData.hour === null) errors.hour = '请选择时辰';
      if (!currentData.country) errors.country = '请选择国家/地区';
      if (!currentData.province) errors.province = '请选择省份/州';
      if (!currentData.city) errors.city = '请选择城市';
    } else if (currentTab === 'liuyao') {
      if (!currentData.divinationMethod) errors.divinationMethod = '请选择起卦方式';
      if (!currentData.questionText?.trim()) errors.questionText = '请输入占问内容';
      if (!currentData.country) errors.country = '请选择国家/地区';
      if (!currentData.province) errors.province = '请选择省份/州';
      if (!currentData.city) errors.city = '请选择城市';
      if (!currentData.gender) errors.gender = '请选择性别';
    } else if (currentTab === 'qimen') {
      if (!currentData.year) errors.year = '请选择年份';
      if (!currentData.month) errors.month = '请选择月份';
      if (!currentData.day) errors.day = '请选择日期';
      if (currentData.hour === undefined || currentData.hour === null) errors.hour = '请选择时辰';
      if (!currentData.country) errors.country = '请选择国家/地区';
      if (!currentData.province) errors.province = '请选择省份/州';
      if (!currentData.city) errors.city = '请选择城市';
      if (!currentData.questionText?.trim()) errors.questionText = '请输入占问内容';
    } else if (currentTab === 'fengshui') {
      if (!currentData.year) errors.year = '请选择年份';
      if (!currentData.month) errors.month = '请选择月份';
      if (!currentData.day) errors.day = '请选择日期';
      if (currentData.hour === undefined || currentData.hour === null) errors.hour = '请选择时辰';
      if (!currentData.country) errors.country = '请选择国家/地区';
      if (!currentData.province) errors.province = '请选择省份/州';
      if (!currentData.city) errors.city = '请选择城市';
      if (!currentData.fengshuiImages?.length) errors.fengshuiImages = '请至少上传一张居家风水图片';
    } else {
      if (!currentData.year) errors.year = '请选择年份';
      if (!currentData.month) errors.month = '请选择月份';
      if (!currentData.day) errors.day = '请选择日期';
      if (currentData.hour === undefined || currentData.hour === null) errors.hour = '请选择时辰';
      if (!currentData.country) errors.country = '请选择国家/地区';
      if (!currentData.province) errors.province = '请选择省份/州';
      if (!currentData.city) errors.city = '请选择城市';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      message.warning(currentTab === 'physiognomy' ? '请先补全图像与个人信息' : '请先补全测算信息');
      return;
    }

    setCurrentView('result');
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
          {currentTab === 'physiognomy' ? (
            <PhysiognomyForm
              value={currentData}
              onChange={updateFormData}
              errors={validationErrors}
            />
          ) : currentTab === 'liuyao' ? (
            <LiuyaoForm
              value={currentData}
              onChange={updateFormData}
              errors={validationErrors}
            />
          ) : (
            <>
              <BirthInfoForm
                value={currentData}
                onChange={updateFormData}
                errors={validationErrors}
                mode={currentTab as CalculationType}
              />

              <LocationInfoForm
                value={currentData}
                onChange={updateFormData}
                errors={validationErrors}
              />

              {currentTab === 'qimen' && (
                <InquiryContentForm
                  value={currentData}
                  onChange={updateFormData}
                  errors={validationErrors}
                  testId="qimen-question-input"
                />
              )}

              {currentTab === 'fengshui' && (
                <FengshuiImageForm
                  value={currentData}
                  onChange={updateFormData}
                  errors={validationErrors}
                />
              )}
            </>
          )}

          <section className="fortune-section-card fortune-section-card-compact">
            <div className="fortune-section-caption">
              {currentTab === 'physiognomy'
                ? '图像与资料仅用于测算'
                : currentTab === 'liuyao'
                  ? '占问信息仅用于占断'
                  : currentTab === 'qimen'
                    ? '占问信息仅用于测算'
                    : currentTab === 'fengshui'
                      ? '环境图片仅用于勘舆分析'
                  : '基本信息仅用于测算'}
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
