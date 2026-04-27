import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Form, Upload } from 'antd';
import { CameraOutlined, UploadOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';
import { BirthInfo, ValidationErrors } from '../../types';

interface FengshuiImageFormProps {
  value: Partial<BirthInfo>;
  onChange: (data: Partial<BirthInfo>) => void;
  errors: ValidationErrors;
}

const toUploadFiles = (
  images: NonNullable<BirthInfo['fengshuiImages']> | undefined
): UploadFile[] =>
  (images ?? []).map((image, index) => ({
    uid: `fengshui-${index}`,
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

const FengshuiImageForm: React.FC<FengshuiImageFormProps> = ({
  value,
  onChange,
  errors
}) => {
  const [fileList, setFileList] = useState<UploadFile[]>(() => toUploadFiles(value.fengshuiImages));

  useEffect(() => {
    setFileList(toUploadFiles(value.fengshuiImages));
  }, [value.fengshuiImages]);

  const updateImageField = useCallback(
    async (nextFiles: UploadFile[]) => {
      const limitedFiles = nextFiles.slice(-6);
      const normalizedImages = await Promise.all(
        limitedFiles.map(async (file, index) => {
          if (file.url) {
            return { name: file.name, url: file.url };
          }

          if (file.originFileObj instanceof File) {
            const url = await readFileAsDataUrl(file.originFileObj);
            return { name: file.name || `fengshui-${index + 1}.png`, url };
          }

          if (file.thumbUrl) {
            return { name: file.name || `fengshui-${index + 1}.png`, url: file.thumbUrl };
          }

          return null;
        })
      );

      onChange({
        ...value,
        fengshuiImages: normalizedImages.filter((image): image is { name: string; url: string } => Boolean(image))
      });
    },
    [onChange, value]
  );

  const handleChange = useCallback(
    async ({ fileList: nextFileList }: { fileList: UploadFile[] }) => {
      setFileList(nextFileList.slice(-6));
      await updateImageField(nextFileList);
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
    <section className="fortune-section-card fortune-fengshui-card">
      <div className="fortune-section-heading">
        <h3>环境图片</h3>
        <span>拍摄居家风水用于格局观察</span>
      </div>

      <Form layout="vertical" size="large" className="fortune-form fortune-fengshui-form">
        <div className={`fortune-upload-panel ${errors.fengshuiImages ? 'is-error' : ''}`}>
          <div className="fortune-upload-panel-head">
            <div className="fortune-upload-panel-icon">
              <CameraOutlined />
            </div>
            <div>
              <h4>居家风水图片</h4>
              <p>建议上传客厅、卧室、入户门、阳台等空间照片，保持画面清晰、完整、无遮挡。</p>
            </div>
          </div>

          <Upload
            listType="picture-card"
            fileList={fileList}
            beforeUpload={() => false}
            onChange={handleChange}
            multiple
            accept="image/*"
          >
            {fileList.length >= 6 ? null : uploadButton}
          </Upload>

          {errors.fengshuiImages && (
            <div className="fortune-inline-message fortune-inline-message-error">
              {errors.fengshuiImages}
            </div>
          )}
        </div>
      </Form>
    </section>
  );
};

export default FengshuiImageForm;
