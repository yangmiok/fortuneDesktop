import React from 'react';
import { Form, Select, Row, Col } from 'antd';
import { BirthInfo, ValidationErrors } from '../../types';
import { 
  YEAR_OPTIONS, 
  MONTH_OPTIONS, 
  TIME_PERIODS 
} from '../../constants';

const { Option } = Select;

interface BirthInfoFormProps {
  value: Partial<BirthInfo>;
  onChange: (data: Partial<BirthInfo>) => void;
  errors: ValidationErrors;
}

const BirthInfoForm: React.FC<BirthInfoFormProps> = ({
  value,
  onChange,
  errors
}) => {
  const handleFieldChange = (field: keyof BirthInfo, fieldValue: any) => {
    onChange({
      ...value,
      [field]: fieldValue
    });
  };

  const getDaysInMonth = (year?: number, month?: number) => {
    if (!year || !month) return 31;
    
    const date = new Date(year, month, 0);
    return date.getDate();
  };

  const getDayOptions = () => {
    const maxDays = getDaysInMonth(value.year, value.month);
    return Array.from({ length: maxDays }, (_, i) => ({
      value: i + 1,
      label: `${i + 1}日`
    }));
  };

  const isValidDate = (year?: number, month?: number, day?: number) => {
    if (!year || !month || !day) return false;
    
    const date = new Date(year, month - 1, day);
    return date.getFullYear() === year && 
           date.getMonth() === month - 1 && 
           date.getDate() === day;
  };

  return (
    <section className="fortune-section-card">
      <div className="fortune-section-heading">
        <h3>出生信息</h3>
        <span>八字 · 命运根基</span>
      </div>

      <Form layout="vertical" size="large" className="fortune-form">
        <Row gutter={[24, 0]}>
          <Col xs={24} md={12}>
            <Form.Item
              label="年份"
              validateStatus={errors.year ? 'error' : ''}
              help={errors.year}
              required
            >
              <Select
                placeholder="选择年份"
                value={value.year}
                onChange={(val) => handleFieldChange('year', val)}
                showSearch
                optionFilterProp="children"
                data-testid="year-select"
              >
                {YEAR_OPTIONS.map(option => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              label="月份"
              validateStatus={errors.month ? 'error' : ''}
              help={errors.month}
              required
            >
              <Select
                placeholder="选择月份"
                value={value.month}
                onChange={(val) => handleFieldChange('month', val)}
                data-testid="month-select"
              >
                {MONTH_OPTIONS.map(option => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              label="日期"
              validateStatus={errors.day ? 'error' : ''}
              help={errors.day}
              required
            >
              <Select
                placeholder="选择日期"
                value={value.day}
                onChange={(val) => handleFieldChange('day', val)}
                data-testid="day-select"
              >
                {getDayOptions().map(option => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              label="时辰"
              validateStatus={errors.hour ? 'error' : ''}
              help={errors.hour}
              required
              extra="不确定时辰可选“不详”"
            >
              <Select
                placeholder="选择时辰"
                value={value.hour}
                onChange={(val) => handleFieldChange('hour', val)}
                data-testid="hour-select"
              >
                {TIME_PERIODS.map(option => (
                  <Option key={option.value} value={option.value}>
                    {option.label.replace(' ', '(') + ')'}
                  </Option>
                ))}
                <Option value={-1}>不详</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        {value.year && value.month && value.day && !isValidDate(value.year, value.month, value.day) && (
          <div className="fortune-inline-message fortune-inline-message-error">
            请检查日期是否正确：{value.year}年{value.month}月{value.day}日
          </div>
        )}
      </Form>
    </section>
  );
};

export default BirthInfoForm;
