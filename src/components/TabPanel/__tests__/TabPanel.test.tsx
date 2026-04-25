import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TabPanel } from '../TabPanel';
import { useAppStore } from '../../../store';

// Mock the store
jest.mock('../../../store', () => ({
  useAppStore: jest.fn()
}));

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('TabPanel Component', () => {
  const mockSetActiveTab = jest.fn();
  const mockSetActiveMenu = jest.fn();
  const mockUpdateFormData = jest.fn();
  const mockSetValidationErrors = jest.fn();
  const mockSubmitCalculation = jest.fn().mockResolvedValue(undefined);
  
  beforeEach(() => {
    jest.clearAllMocks();
    (useAppStore as unknown as jest.Mock).mockReturnValue({
      ui: { activeTab: 'bazi', activeMenu: 'home' },
      form: {
        currentData: {
          year: 2006,
          month: 1,
          day: 1,
          hour: 0,
          country: '中国',
          province: '北京市',
          city: '朝阳区'
        },
        validationErrors: {},
        isSubmitting: false
      },
      setActiveTab: mockSetActiveTab,
      setActiveMenu: mockSetActiveMenu,
      updateFormData: mockUpdateFormData,
      setValidationErrors: mockSetValidationErrors,
      submitCalculation: mockSubmitCalculation
    });
  });

  test('应该渲染所有标签页', () => {
    render(<TabPanel />);
    
    expect(screen.getAllByText('四柱八字').length).toBeGreaterThan(0);
    expect(screen.getAllByText('紫微斗数').length).toBeGreaterThan(0);
    expect(screen.getAllByText('六爻预测').length).toBeGreaterThan(0);
    expect(screen.getAllByText('奇门遁甲').length).toBeGreaterThan(0);
    expect(screen.getAllByText('风水堪舆').length).toBeGreaterThan(0);
  });

  test('应该显示默认选中的标签页内容', () => {
    render(<TabPanel />);
    
    expect(screen.getByText('出生信息')).toBeInTheDocument();
    expect(screen.getByText('地点信息')).toBeInTheDocument();
  });

  test('应该能够切换标签页', async () => {
    render(<TabPanel />);
    
    // 点击紫微斗数标签
    const ziWeiTab = screen.getByText('紫微斗数');
    fireEvent.click(ziWeiTab);
    
    // 验证状态更新被调用
    await waitFor(() => {
      expect(mockSetActiveTab).toHaveBeenCalledWith('ziwei');
      expect(mockSetActiveMenu).toHaveBeenCalledWith('ziwei');
    });
  });

  test('应该保存标签状态到本地存储', async () => {
    render(<TabPanel />);
    
    // 点击六爻预测标签
    const liuYaoTab = screen.getByText('六爻预测');
    fireEvent.click(liuYaoTab);
    
    // 验证本地存储被调用
    await waitFor(() => {
      expect(localStorageMock.setItem).toHaveBeenCalledWith('fortune_active_tab', 'liuyao');
    });
  });

  test('应该从本地存储恢复标签状态', () => {
    // 模拟本地存储返回保存的标签
    localStorageMock.getItem.mockReturnValue('qimen');
    
    render(<TabPanel />);
    
    // 验证从本地存储读取
    expect(localStorageMock.getItem).toHaveBeenCalledWith('fortune_active_tab');
    expect(mockSetActiveTab).toHaveBeenCalledWith('qimen');
  });

  test('应该处理本地存储错误', () => {
    // 模拟本地存储抛出错误
    localStorageMock.getItem.mockImplementation(() => {
      throw new Error('Storage error');
    });
    
    // 应该不会崩溃
    expect(() => render(<TabPanel />)).not.toThrow();
  });

  test('应该显示每个标签页的描述信息', () => {
    render(<TabPanel />);
    
    expect(screen.getByText('八字 · 命运根基')).toBeInTheDocument();
    fireEvent.click(screen.getByText('紫微斗数'));
    expect(mockSetActiveTab).toHaveBeenCalledWith('ziwei');
  });

  test('应该显示输入和结果区域', () => {
    render(<TabPanel />);
    
    expect(screen.getByText('基本信息')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '提交测算' })).toBeInTheDocument();
  });

  test('应该响应全局状态变化', () => {
    const { rerender } = render(<TabPanel />);
    
    (useAppStore as unknown as jest.Mock).mockReturnValue({
      ui: { activeTab: 'fengshui', activeMenu: 'fengshui' },
      form: {
        currentData: {
          year: 2006,
          month: 1,
          day: 1,
          hour: 0,
          country: '中国',
          province: '北京市',
          city: '朝阳区'
        },
        validationErrors: {},
        isSubmitting: false
      },
      setActiveTab: mockSetActiveTab,
      setActiveMenu: mockSetActiveMenu,
      updateFormData: mockUpdateFormData,
      setValidationErrors: mockSetValidationErrors,
      submitCalculation: mockSubmitCalculation
    });

    rerender(<TabPanel />);

    expect(screen.getAllByText('风水堪舆').length).toBeGreaterThan(0);
  });
});
