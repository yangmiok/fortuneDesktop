import React, { useEffect } from 'react';
import { Form, Select, Row, Col } from 'antd';
import { BirthInfo, ValidationErrors } from '../../types';
import { LOCATION_DATA } from '../../constants';

const { Option } = Select;
type SelectOption = { value: string; label: string };

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
  const handleFieldChange = (field: keyof BirthInfo, fieldValue: any) => {
    const newValue = {
      ...value,
      [field]: fieldValue
    };

    if (field === 'country') {
      const provinceOptions = LOCATION_DATA[fieldValue]
        ? Object.keys(LOCATION_DATA[fieldValue])
        : [];
      const nextProvince = provinceOptions[0] || '';
      const cityOptions = nextProvince ? LOCATION_DATA[fieldValue][nextProvince] : [];

      newValue.province = nextProvince;
      newValue.city = cityOptions[0] || '';
    } else if (field === 'province') {
      const cityOptions = value.country && LOCATION_DATA[value.country]?.[fieldValue]
        ? LOCATION_DATA[value.country][fieldValue]
        : [];
      newValue.city = cityOptions[0] || '';
    }

    onChange(newValue);
  };

  const getCountryOptions = () => {
    return Object.keys(LOCATION_DATA).map(country => ({
      value: country,
      label: country
    })) as SelectOption[];
  };

  const getProvinceOptions = () => {
    if (!value.country || !LOCATION_DATA[value.country]) {
      return [];
    }
    
    return Object.keys(LOCATION_DATA[value.country]).map(province => ({
      value: province,
      label: province
    })) as SelectOption[];
  };

  const getCityOptions = () => {
    if (!value.country || !value.province || 
        !LOCATION_DATA[value.country] || 
        !LOCATION_DATA[value.country][value.province]) {
      return [];
    }
    
    return LOCATION_DATA[value.country][value.province].map(city => ({
      value: city,
      label: city
    })) as SelectOption[];
  };

  const validateLocationConsistency = () => {
    if (!value.country || !value.province || !value.city) {
      return true;
    }

    const countryData = LOCATION_DATA[value.country];
    if (!countryData) return false;

    const provinceData = countryData[value.province];
    if (!provinceData) return false;

    return provinceData.includes(value.city);
  };

  useEffect(() => {
    if (value.province && value.city) {
      const cityOptions = getCityOptions();
      const isCityValid = cityOptions.some((option: SelectOption) => option.value === value.city);
      
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
    <section className="fortune-section-card">
      <div className="fortune-section-heading">
        <h3>地点信息</h3>
        <span>用于时区/真太阳时参考</span>
      </div>

      <Form layout="vertical" size="large" className="fortune-form">
        <Row gutter={[24, 0]}>
          <Col xs={24} md={12}>
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
                {getCountryOptions().map((option: SelectOption) => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} md={12} />

          <Col xs={24} md={12}>
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
                {getProvinceOptions().map((option: SelectOption) => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
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
                optionFilterProp="children"
              >
                {getCityOptions().map((option: SelectOption) => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        {value.country && value.province && value.city && !isLocationConsistent && (
          <div className="fortune-inline-message fortune-inline-message-error">
            位置信息不一致：{value.city} 不属于 {value.province}
          </div>
        )}
      </Form>
    </section>
  );
};

export default LocationInfoForm;
