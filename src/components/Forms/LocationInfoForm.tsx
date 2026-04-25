import React, { useEffect } from 'react';
import { Form, Select, Row, Col, Card, Typography } from 'antd';
import { BirthInfo, ValidationErrors } from '../../types';
import { LOCATION_DATA } from '../../constants';

const { Title } = Typography;
const { Option } = Select;

interface LocationInfoFormProps {
  value: Partial<BirthInfo>;
  onChange: (data: Partial<BirthInfo>) => void;
  errors: ValidationErrors;
}

const LocationInfoForm: React.FC<LocationInfoFormProps> = ({
  value,
  onChange,
  errors
}) => {
  // 处理字段变更
  const handleFieldChange = (field: keyof BirthInfo, fieldValue: any) => {
    const newValue = {
      ...value,
      [field]: fieldValue
    };

    // 如果改变了国家或省份，需要重置下级选项
    if (field === 'country') {
      newValue.province = '';
      newValue.city = '';
    } else if (field === 'province') {
      newValue.city = '';
    }

    onChange(newValue);
  };

  // 获取国家选项
  const getCountryOptions = () => {
    return Object.keys(LOCATION_DATA).map(country => ({
      value: country,
      label: country
    }));
  };

  // 获取省份选项
  const getProvinceOptions = () => {
    if (!value.country || !LOCATION_DATA[value.country]) {
      return [];
    }
    
    return Object.keys(LOCATION_DATA[value.country]).map(province => ({
      value: province,
      label: province
    }));
  };

  // 获取城市选项
  const getCityOptions = () => {
    if (!value.country || !value.province || 
        !LOCATION_DATA[value.country] || 
        !LOCATION_DATA[value.country][value.province]) {
      return [];
    }
    
    return LOCATION_DATA[value.country][value.province].map(city => ({
      value: city,
      label: city
    }));
  };

  // 验证位置一致性
  const validateLocationConsistency = () => {
    if (!value.country || !value.province || !value.city) {
      return true; // 不完整的选择不进行一致性验证
    }

    const countryData = LOCATION_DATA[value.country];
    if (!countryData) return false;

    const provinceData = countryData[value.province];
    if (!provinceData) return false;

    return provinceData.includes(value.city);
  };

  // 当省份改变时，如果当前城市不在新省份中，清空城市选择
  useEffect(() => {
    if (value.province && value.city) {
      const cityOptions = getCityOptions();
      const isCityValid = cityOptions.some(option => option.value === value.city);
      
      if (!isCityValid) {
        onChange({
          ...value,
          city: ''
        });
      }
    }
  }, [value.province]); // eslint-disable-line react-hooks/exhaustive-deps

  const isLocationConsistent = validateLocationConsistency();

  return (
    <Card title={<Title level={4}>出生地点</Title>} className="location-info-form">
      <Form layout="vertical" size="large">
        <Row gutter={[16, 16]}>
          {/* 国家/地区 */}
          <Col xs={24} sm={8}>
            <Form.Item
              label="国家/地区"
              validateStatus={errors.country ? 'error' : ''}
              help={errors.country}
              required
            >
              <Select
                placeholder="选择国家/地区"
                value={value.country}
                onChange={(val) => handleFieldChange('country', val)}
                data-testid="country-select"
              >
                {getCountryOptions().map(option => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          {/* 省份/州 */}
          <Col xs={24} sm={8}>
            <Form.Item
              label="省份/州"
              validateStatus={errors.province ? 'error' : ''}
              help={errors.province}
              required
            >
              <Select
                placeholder="选择省份/州"
                value={value.province}
                onChange={(val) => handleFieldChange('province', val)}
                disabled={!value.country}
                data-testid="province-select"
              >
                {getProvinceOptions().map(option => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          {/* 城市 */}
          <Col xs={24} sm={8}>
            <Form.Item
              label="城市"
              validateStatus={errors.city ? 'error' : ''}
              help={errors.city}
              required
            >
              <Select
                placeholder="选择城市"
                value={value.city}
                onChange={(val) => handleFieldChange('city', val)}
                disabled={!value.province}
                data-testid="city-select"
                showSearch
                filterOption={(input, option) =>
                  option?.children?.toString().toLowerCase().includes(input.toLowerCase()) ?? false
                }
              >
                {getCityOptions().map(option => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        {/* 位置一致性验证提示 */}
        {value.country && value.province && value.city && !isLocationConsistent && (
          <Row>
            <Col span={24}>
              <div style={{ color: '#ff4d4f', fontSize: '14px', marginTop: '8px' }}>
                ⚠️ 位置信息不一致：{value.city} 不属于 {value.province}
              </div>
            </Col>
          </Row>
        )}

        {/* 特殊提示：北京市16个区 */}
        {value.country === '中国' && value.province === '北京市' && (
          <Row>
            <Col span={24}>
              <div style={{ color: '#1890ff', fontSize: '12px', marginTop: '8px' }}>
                💡 北京市包含16个区：东城区、西城区、朝阳区、丰台区、石景山区、海淀区、门头沟区、房山区、通州区、顺义区、昌平区、大兴区、怀柔区、平谷区、密云区、延庆区
              </div>
            </Col>
          </Row>
        )}
      </Form>
    </Card>
  );
};

export default LocationInfoForm;