import React from 'react';
import { Form, Input } from 'antd';
import { BirthInfo, ValidationErrors } from '../../types';

interface InquiryContentFormProps {
  value: Partial<BirthInfo>;
  onChange: (data: Partial<BirthInfo>) => void;
  errors: ValidationErrors;
  title?: string;
  subtitle?: string;
  placeholder?: string;
  testId?: string;
}

const InquiryContentForm: React.FC<InquiryContentFormProps> = ({
  value,
  onChange,
  errors,
  title = '占问内容',
  subtitle = '越具体越准',
  placeholder = '例如：这次合作能否顺利推进？预计何时有结果？',
  testId = 'inquiry-question-input'
}) => {
  return (
    <section className="fortune-section-card">
      <div className="fortune-section-heading">
        <h3>{title}</h3>
        <span>{subtitle}</span>
      </div>

      <Form layout="vertical" size="large" className="fortune-form">
        <Form.Item
          label="你想问什么？"
          validateStatus={errors.questionText ? 'error' : ''}
          help={errors.questionText}
          required
        >
          <Input.TextArea
            rows={5}
            maxLength={120}
            placeholder={placeholder}
            value={value.questionText}
            onChange={(event) =>
              onChange({
                ...value,
                questionText: event.target.value
              })
            }
            className="fortune-textarea fortune-liuyao-textarea"
            data-testid={testId}
          />
        </Form.Item>
      </Form>
    </section>
  );
};

export default InquiryContentForm;
