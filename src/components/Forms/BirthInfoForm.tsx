import React from 'react';
import { Form, Select, Row, Col, Card, Typography } from 'antd';
import { BirthInfo, ValidationErrors } from '../../types';
import { 
  YEAR_OPTIONS, 
  MONTH_OPTIONS, 
  DAY_OPTIONS, 
  TIME_PERIODS 
} from '../../constants';

const { Title } = Typography;
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
  // 处理字段变更
  const handleFieldChange = (field: keyof BirthInfo, fieldValue: any) => {
    onChange({
      ...value,
      [field]: fieldValue
    });
  };

  // 获取当前月份的天数
  const getDaysInMonth = (year?: number, month?: number) => {
    if (!year || !month) return 31;
    
    const date = new Date(year, month, 0);
    return date.getDate();
  };

  // 生成日期选项（根据年月动态调整）
  const getDayOptions = () => {
    const maxDays = getDaysInMonth(value.year, value.month);
    return Array.from({ length: maxDays }, (_, i) => ({
      value: i + 1,
      label: `${i + 1}日`
    }));
  };

  // 验证日期有效性
  const isValidDate = (year?: number, month?: number, day?: number) => {
    if (!year || !month || !day) return false;
    
    const date = new Date(year, month - 1, day);
    return date.getFullYear() === year && 
           date.getMonth() === month - 1 && 
           date.getDate() === day;
  };

  return (
    <Card title={<Title level={4}>出生信息</Title>} className="birth-info-form">
      <Form layout="vertical" size="large">
        <Row gutter={[16, 16]}>
          {/* 出生年份 */}
          <Col xs={24} sm={12} md={6}>
            <Form.Item
              label="出生年份"
              validateStatus={errors.year ? 'error' : ''}
              help={errors.year}
              required
            >
              <Select
                placeholder="选择年份"
                value={value.year}
                onChange={(val) => handleFieldChange('year', val)}
                showSearch
                filterOption={(input, option) =>
                  option?.children?.toString().toLowerCase().includes(input.toLowerCase()) ?? false
                }
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

          {/* 出生月份 */}
          <Col xs={24} sm={12} md={6}>
            <Form.Item
              label="出生月份"
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

          {/* 出生日期 */}
          <Col xs={24} sm={12} md={6}>
            <Form.Item
              label="出生日期"
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

          {/* 出生时辰 */}
          <Col xs={24} sm={12} md={6}>
            <Form.Item
              label="出生时辰"
              validateStatus={errors.hour ? 'error' : ''}
              help={errors.hour}
              required
            >
              <Select
                placeholder="选择时辰"
                value={value.hour}
                onChange={(val) => handleFieldChange('hour', val)}
                data-testid="hour-select"
              >
                {TIME_PERIODS.map(option => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        {/* 日期验证提示 */}
        {value.year && value.month && value.day && !isValidDate(value.year, value.month, value.day) && (
          <Row>
            <Col span={24}>
              <div style={{ color: '#ff4d4f', fontSize: '14px', marginTop: '8px' }}>
                ⚠️ 请检查日期是否正确：{value.year}年{value.month}月{value.day}日
              </div>
            </Col>
          </Row>
        )}
      </Form>
    </Card>
  );
};

export default BirthInfoForm;