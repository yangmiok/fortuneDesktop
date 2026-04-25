// 工具函数

import { BirthInfo, ValidationErrors, InputError, InputErrorType } from '../types';
import { ERROR_MESSAGES } from '../constants';

/**
 * 验证日期是否有效
 */
export function isValidDate(year: number, month: number, day: number): boolean {
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && 
         date.getMonth() === month - 1 && 
         date.getDate() === day;
}

/**
 * 验证出生信息
 */
export function validateBirthInfo(birthInfo: Partial<BirthInfo>): InputError[] {
  const errors: InputError[] = [];
  
  // 检查必填字段
  const requiredFields: (keyof BirthInfo)[] = ['year', 'month', 'day', 'hour', 'country', 'province', 'city'];
  
  for (const field of requiredFields) {
    if (!birthInfo[field] && birthInfo[field] !== 0) {
      errors.push({
        type: InputErrorType.MISSING_REQUIRED_FIELD,
        field,
        message: `${getFieldDisplayName(field)}为必填项`,
        suggestion: `请选择或输入${getFieldDisplayName(field)}`
      });
    }
  }
  
  // 验证日期有效性
  if (birthInfo.year && birthInfo.month && birthInfo.day) {
    if (!isValidDate(birthInfo.year, birthInfo.month, birthInfo.day)) {
      errors.push({
        type: InputErrorType.INVALID_DATE,
        field: 'date',
        message: ERROR_MESSAGES.INVALID_DATE,
        suggestion: '请检查年月日的组合是否正确'
      });
    }
  }
  
  // 验证时间格式
  if (birthInfo.hour !== undefined && (birthInfo.hour < 0 || birthInfo.hour > 23)) {
    errors.push({
      type: InputErrorType.INVALID_TIME_FORMAT,
      field: 'hour',
      message: '小时必须在0-23之间',
      suggestion: '请选择正确的时辰'
    });
  }
  
  if (birthInfo.minute !== undefined && (birthInfo.minute < 0 || birthInfo.minute > 59)) {
    errors.push({
      type: InputErrorType.INVALID_TIME_FORMAT,
      field: 'minute',
      message: '分钟必须在0-59之间',
      suggestion: '请输入正确的分钟数'
    });
  }
  
  return errors;
}

/**
 * 获取字段显示名称
 */
export function getFieldDisplayName(field: string): string {
  const fieldNames: Record<string, string> = {
    year: '出生年份',
    month: '出生月份',
    day: '出生日期',
    hour: '出生时辰',
    minute: '出生分钟',
    country: '国家',
    province: '省份',
    city: '城市'
  };
  
  return fieldNames[field] || field;
}

/**
 * 将验证错误转换为表单错误格式
 */
export function convertToValidationErrors(inputErrors: InputError[]): ValidationErrors {
  const errors: ValidationErrors = {};
  
  for (const error of inputErrors) {
    errors[error.field] = error.message;
  }
  
  return errors;
}

/**
 * 生成唯一ID
 */
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * 格式化日期时间
 */
export function formatDateTime(date: Date): string {
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}

/**
 * 格式化出生信息为显示文本
 */
export function formatBirthInfo(birthInfo: BirthInfo): string {
  return `${birthInfo.year}年${birthInfo.month}月${birthInfo.day}日 ${birthInfo.hour}:${birthInfo.minute.toString().padStart(2, '0')} ${birthInfo.province} ${birthInfo.city}`;
}

/**
 * 深拷贝对象
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  if (obj instanceof Date) {
    return new Date(obj.getTime()) as unknown as T;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => deepClone(item)) as unknown as T;
  }
  
  const cloned = {} as T;
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }
  
  return cloned;
}

/**
 * 防抖函数
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * 节流函数
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * 本地存储工具
 */
export const storage = {
  get<T>(key: string, defaultValue?: T): T | null {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue || null;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return defaultValue || null;
    }
  },
  
  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  },
  
  remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  },
  
  clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }
};