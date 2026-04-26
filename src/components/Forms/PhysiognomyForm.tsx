import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Form, Select, Row, Col, InputNumber, Upload, Input, Radio } from 'antd';
import {
  CameraOutlined,
  UserOutlined,
  ScanOutlined,
  UploadOutlined
} from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';
import { BirthInfo, ValidationErrors } from '../../types';

interface PhysiognomyFormProps {
  value: Partial<BirthInfo>;
  onChange: (data: Partial<BirthInfo>) => void;
  errors: ValidationErrors;
}

const physiognomyModeOptions = [
  { value: 'both', label: '手相 + 面相' },
  { value: 'palm', label: '仅手相' },
  { value: 'face', label: '仅面相' }
] as const;

const genderOptions = [
  { value: 'male', label: '男' },
  { value: 'female', label: '女' }
] as const;

const palmSideOptions = [
  { value: 'left', label: '左手' },
  { value: 'right', label: '右手' },
  { value: 'both', label: '双手' }
] as const;

const toUploadFiles = (
  images: NonNullable<BirthInfo['palmImages']> | NonNullable<BirthInfo['faceImages']> | undefined,
  prefix: string
): UploadFile[] =>
  (images ?? []).map((image, index) => ({
    uid: `${prefix}-${index}`,
    name: image.name,
    status: 'done',
    url: image.url
  }));

const readFileAsDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : '');
    reader.onerror = () => reject(new Error('文件读取失败'));
    reader.readAsDataURL(file);
  });

const PhysiognomyForm: React.FC<PhysiognomyFormProps> = ({
  value,
  onChange,
  errors
}) => {
  const [palmFileList, setPalmFileList] = useState<UploadFile[]>(() =>
    toUploadFiles(value.palmImages, 'palm')
  );
  const [faceFileList, setFaceFileList] = useState<UploadFile[]>(() =>
    toUploadFiles(value.faceImages, 'face')
  );

  useEffect(() => {
    setPalmFileList(toUploadFiles(value.palmImages, 'palm'));
  }, [value.palmImages]);

  useEffect(() => {
    setFaceFileList(toUploadFiles(value.faceImages, 'face'));
  }, [value.faceImages]);

  const mode = value.physiognomyMode ?? 'both';
  const showPalmUploader = mode === 'both' || mode === 'palm';
  const showFaceUploader = mode === 'both' || mode === 'face';

  const handleFieldChange = useCallback(
    (field: keyof BirthInfo, fieldValue: BirthInfo[keyof BirthInfo]) => {
      onChange({
        ...value,
        [field]: fieldValue
      });
    },
    [onChange, value]
  );

  const updateImageField = useCallback(
    async (kind: 'palmImages' | 'faceImages', nextFiles: UploadFile[]) => {
      const limitedFiles = nextFiles.slice(-4);
      const normalizedImages = await Promise.all(
        limitedFiles.map(async (file, index) => {
          if (file.url) {
            return { name: file.name, url: file.url };
          }

          if (file.originFileObj instanceof File) {
            const url = await readFileAsDataUrl(file.originFileObj);
            return { name: file.name || `${kind}-${index + 1}.png`, url };
          }

          if (file.thumbUrl) {
            return { name: file.name || `${kind}-${index + 1}.png`, url: file.thumbUrl };
          }

          return null;
        })
      );

      onChange({
        ...value,
        [kind]: normalizedImages.filter((image): image is { name: string; url: string } => Boolean(image))
      });
    },
    [onChange, value]
  );

  const handlePalmChange = useCallback(
    async ({ fileList }: { fileList: UploadFile[] }) => {
      setPalmFileList(fileList.slice(-4));
      await updateImageField('palmImages', fileList);
    },
    [updateImageField]
  );

  const handleFaceChange = useCallback(
    async ({ fileList }: { fileList: UploadFile[] }) => {
      setFaceFileList(fileList.slice(-4));
      await updateImageField('faceImages', fileList);
    },
    [updateImageField]
  );

  const uploadButton = useMemo(
    () => (
      <div className="fortune-upload-trigger">
        <UploadOutlined />
        <span>上传图片</span>
      </div>
    ),
    []
  );

  return (
    <section className="fortune-section-card fortune-physiognomy-card">
      <div className="fortune-section-heading">
        <h3>手相面相录入</h3>
        <span>上传清晰图像用于特征分析</span>
      </div>

      <Form layout="vertical" size="large" className="fortune-form fortune-physiognomy-form">
        <Row gutter={[24, 0]}>
          <Col xs={24} lg={8}>
            <Form.Item
              label="分析方向"
              validateStatus={errors.physiognomyMode ? 'error' : ''}
              help={errors.physiognomyMode}
              required
            >
              <Select
                value={mode}
                onChange={(val) => handleFieldChange('physiognomyMode', val)}
                options={physiognomyModeOptions as unknown as { value: string; label: string }[]}
                data-testid="physiognomy-mode-select"
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} lg={8}>
            <Form.Item
              label="性别"
              validateStatus={errors.gender ? 'error' : ''}
              help={errors.gender}
              required
            >
              <Select
                placeholder="选择性别"
                value={value.gender}
                onChange={(val) => handleFieldChange('gender', val)}
                options={genderOptions as unknown as { value: string; label: string }[]}
                data-testid="physiognomy-gender-select"
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} lg={8}>
            <Form.Item
              label="年龄"
              validateStatus={errors.age ? 'error' : ''}
              help={errors.age}
              required
            >
              <InputNumber
                min={1}
                max={120}
                placeholder="输入年龄"
                value={value.age}
                onChange={(val) => handleFieldChange('age', val ?? undefined)}
                className="fortune-number-input"
                data-testid="physiognomy-age-input"
              />
            </Form.Item>
          </Col>

          {showPalmUploader && (
            <Col xs={24} lg={8}>
              <Form.Item
                label="手掌选择"
                validateStatus={errors.palmSide ? 'error' : ''}
                help={errors.palmSide}
                required
              >
                <Radio.Group
                  value={value.palmSide ?? 'right'}
                  onChange={(event) => handleFieldChange('palmSide', event.target.value)}
                  className="fortune-segmented-radio"
                >
                  {palmSideOptions.map((option) => (
                    <Radio.Button key={option.value} value={option.value}>
                      {option.label}
                    </Radio.Button>
                  ))}
                </Radio.Group>
              </Form.Item>
            </Col>
          )}
        </Row>

        <div className="fortune-physiognomy-upload-grid">
          {showPalmUploader && (
            <div className={`fortune-upload-panel ${errors.palmImages ? 'is-error' : ''}`}>
              <div className="fortune-upload-panel-head">
                <div className="fortune-upload-panel-icon">
                  <CameraOutlined />
                </div>
                <div>
                  <h4>手掌图片</h4>
                  <p>建议上传掌心正面，掌纹清晰、无遮挡、自然光线。</p>
                </div>
              </div>

              <Upload
                listType="picture-card"
                fileList={palmFileList}
                beforeUpload={() => false}
                onChange={handlePalmChange}
                multiple
                accept="image/*"
              >
                {palmFileList.length >= 4 ? null : uploadButton}
              </Upload>

              {errors.palmImages && (
                <div className="fortune-inline-message fortune-inline-message-error">
                  {errors.palmImages}
                </div>
              )}
            </div>
          )}

          {showFaceUploader && (
            <div className={`fortune-upload-panel ${errors.faceImages ? 'is-error' : ''}`}>
              <div className="fortune-upload-panel-head">
                <div className="fortune-upload-panel-icon">
                  <UserOutlined />
                </div>
                <div>
                  <h4>面部图片</h4>
                  <p>建议上传正脸清晰照片，五官完整可见，避免浓滤镜与遮挡。</p>
                </div>
              </div>

              <Upload
                listType="picture-card"
                fileList={faceFileList}
                beforeUpload={() => false}
                onChange={handleFaceChange}
                multiple
                accept="image/*"
              >
                {faceFileList.length >= 4 ? null : uploadButton}
              </Upload>

              {errors.faceImages && (
                <div className="fortune-inline-message fortune-inline-message-error">
                  {errors.faceImages}
                </div>
              )}
            </div>
          )}
        </div>

        <Row gutter={[24, 0]}>
          <Col span={24}>
            <Form.Item
              label="补充说明"
              extra="可补充职业、关注方向或特别想了解的内容，帮助更聚焦地解读。"
            >
              <Input.TextArea
                rows={4}
                maxLength={120}
                placeholder="例如：想重点了解事业发展、感情状态，或补充照片拍摄背景。"
                value={value.analysisNotes}
                onChange={(event) => handleFieldChange('analysisNotes', event.target.value)}
                className="fortune-textarea"
              />
            </Form.Item>
          </Col>
        </Row>

        <div className="fortune-physiognomy-note">
          <ScanOutlined />
          <span>图片仅用于本次测算分析，不会作为公开素材展示。</span>
        </div>
      </Form>
    </section>
  );
};

export default PhysiognomyForm;
