import React, { useEffect } from 'react';
import { Form, Select, Row, Col } from 'antd';
import { BirthInfo, ValidationErrors } from '../../types';
import { LOCATION_DATA } from '../../constants';
import InquiryContentForm from './InquiryContentForm';

const { Option } = Select;

interface LiuyaoFormProps {
  value: Partial<BirthInfo>;
  onChange: (data: Partial<BirthInfo>) => void;
  errors: ValidationErrors;
}

type SelectOption = { value: string; label: string };

const divinationMethodOptions = [
  { value: 'time', label: '时间起卦' },
  { value: 'number', label: '数字起卦' },
  { value: 'coins', label: '铜钱起卦' }
] as const;

const genderOptions = [
  { value: 'male', label: '男' },
  { value: 'female', label: '女' }
] as const;

const LiuyaoForm: React.FC<LiuyaoFormProps> = ({
  value,
  onChange,
  errors
}) => {
  useEffect(() => {
    const nextData: Partial<BirthInfo> = {};

    if (!value.divinationMethod) {
      nextData.divinationMethod = 'time';
    }

    if (!value.gender) {
      nextData.gender = 'male';
    }

    if (Object.keys(nextData).length > 0) {
      onChange({
        ...value,
        ...nextData
      });
    }
  }, [onChange, value]);

  const handleFieldChange = (field: keyof BirthInfo, fieldValue: BirthInfo[keyof BirthInfo]) => {
    const nextValue = {
      ...value,
      [field]: fieldValue
    };

    if (field === 'country') {
      const provinceOptions = LOCATION_DATA[fieldValue as string]
        ? Object.keys(LOCATION_DATA[fieldValue as string])
        : [];
      const nextProvince = provinceOptions[0] || '';
      const cityOptions = nextProvince ? LOCATION_DATA[fieldValue as string][nextProvince] : [];

      nextValue.province = nextProvince;
      nextValue.city = cityOptions[0] || '';
    } else if (field === 'province') {
      const cityOptions = value.country && LOCATION_DATA[value.country]?.[fieldValue as string]
        ? LOCATION_DATA[value.country][fieldValue as string]
        : [];
      nextValue.city = cityOptions[0] || '';
    }

    onChange(nextValue);
  };

  const getCountryOptions = (): SelectOption[] =>
    Object.keys(LOCATION_DATA).map((country) => ({
      value: country,
      label: country
    }));

  const getProvinceOptions = (): SelectOption[] => {
    if (!value.country || !LOCATION_DATA[value.country]) {
      return [];
    }

    return Object.keys(LOCATION_DATA[value.country]).map((province) => ({
      value: province,
      label: province
    }));
  };

  const getCityOptions = (): SelectOption[] => {
    if (!value.country || !value.province || !LOCATION_DATA[value.country]?.[value.province]) {
      return [];
    }

    return LOCATION_DATA[value.country][value.province].map((city) => ({
      value: city,
      label: city
    }));
  };

  return (
    <section className="fortune-section-card fortune-liuyao-card">
      <Form layout="vertical" size="large" className="fortune-form">
        <div className="fortune-liuyao-section">
          <div className="fortune-section-heading">
            <h3>起卦信息</h3>
            <span>六爻 · 即时占断</span>
          </div>

          <Form.Item
            label="起卦方式"
            validateStatus={errors.divinationMethod ? 'error' : ''}
            help={errors.divinationMethod}
            required
          >
            <Select
              value={value.divinationMethod}
              onChange={(val) => handleFieldChange('divinationMethod', val)}
              data-testid="liuyao-method-select"
            >
              {divinationMethodOptions.map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </div>

        <div className="fortune-liuyao-divider" />

        <InquiryContentForm
          value={value}
          onChange={onChange}
          errors={errors}
          testId="liuyao-question-input"
        />

        <div className="fortune-liuyao-divider" />

        <div className="fortune-liuyao-section">
          <Row gutter={[24, 0]}>
            <Col span={24}>
              <Form.Item
                label="国家/地区"
                validateStatus={errors.country ? 'error' : ''}
                help={errors.country}
                required
              >
                <Select
                  value={value.country}
                  onChange={(val) => handleFieldChange('country', val)}
                  data-testid="liuyao-country-select"
                >
                  {getCountryOptions().map((option) => (
                    <Option key={option.value} value={option.value}>
                      {option.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label="地点（省/州）"
                validateStatus={errors.province ? 'error' : ''}
                help={errors.province}
                required
              >
                <Select
                  placeholder="请选择省份/州"
                  value={value.province}
                  onChange={(val) => handleFieldChange('province', val)}
                  disabled={!value.country}
                  data-testid="liuyao-province-select"
                >
                  {getProvinceOptions().map((option) => (
                    <Option key={option.value} value={option.value}>
                      {option.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label="地点（市）"
                validateStatus={errors.city ? 'error' : ''}
                help={errors.city}
                required
              >
                <Select
                  placeholder="请选择城市"
                  value={value.city}
                  onChange={(val) => handleFieldChange('city', val)}
                  disabled={!value.province}
                  data-testid="liuyao-city-select"
                >
                  {getCityOptions().map((option) => (
                    <Option key={option.value} value={option.value}>
                      {option.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="性别"
            validateStatus={errors.gender ? 'error' : ''}
            help={errors.gender}
            required
          >
            <div className="fortune-choice-toggle" data-testid="liuyao-gender-toggle">
              {genderOptions.map((option) => {
                const isActive = value.gender === option.value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    className={`fortune-choice-button ${isActive ? 'is-active' : ''}`}
                    onClick={() => handleFieldChange('gender', option.value)}
                  >
                    <span className="fortune-choice-button-dot" aria-hidden="true" />
                    <span>{option.label}</span>
                  </button>
                );
              })}
            </div>
          </Form.Item>
        </div>
      </Form>
    </section>
  );
};

export default LiuyaoForm;
