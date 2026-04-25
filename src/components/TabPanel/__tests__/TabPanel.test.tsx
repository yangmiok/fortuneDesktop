import React from 'react';
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
  
  beforeEach(() => {
    jest.clearAllMocks();
    (useAppStore as jest.Mock).mockReturnValue({
      ui: { activeTab: 'bazi' },
      setActiveTab: mockSetActiveTab
    });
  });

  test('应该渲染所有标签页', () => {
    render(<TabPanel />);
    
    // 验证所有标签页都存在
    expect(screen.getByText('四柱八字')).toBeInTheDocument();
    expect(screen.getByText('紫微斗数')).toBeInTheDocument();
    expect(screen.getByText('六爻预测')).toBeInTheDocument();
    expect(screen.getByText('奇门遁甲')).toBeInTheDocument();
    expect(screen.getByText('风水堪舆')).toBeInTheDocument();
  });

  test('应该显示默认选中的标签页内容', () => {
    render(<TabPanel />);
    
    // 验证默认标签页内容显示
    expect(screen.getByText('根据出生年月日时推算命理格局')).toBeInTheDocument();
    expect(screen.getByText('四柱八字计算表单将在此处显示')).toBeInTheDocument();
  });

  test('应该能够切换标签页', async () => {
    render(<TabPanel />);
    
    // 点击紫微斗数标签
    const ziWeiTab = screen.getByText('紫微斗数');
    fireEvent.click(ziWeiTab);
    
    // 验证状态更新被调用
    await waitFor(() => {
      expect(mockSetActiveTab).toHaveBeenCalledWith('ziwei');
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
    
    // 验证默认标签页描述
    expect(screen.getByText('根据出生年月日时推算命理格局')).toBeInTheDocument();
    
    // 切换到紫微斗数并验证描述
    fireEvent.click(screen.getByText('紫微斗数'));
    expect(screen.getByText('紫微星系命盘分析人生运势')).toBeInTheDocument();
  });

  test('应该显示输入和结果区域', () => {
    render(<TabPanel />);
    
    // 验证输入区域
    expect(screen.getByText('输入信息')).toBeInTheDocument();
    expect(screen.getByText('四柱八字计算表单将在此处显示')).toBeInTheDocument();
    
    // 验证结果区域
    expect(screen.getByText('计算结果')).toBeInTheDocument();
    expect(screen.getByText('四柱八字计算结果将在此处显示')).toBeInTheDocument();
  });

  test('应该响应全局状态变化', () => {
    const { rerender } = render(<TabPanel />);
    
    // 更新mock返回值
    (useAppStore as jest.Mock).mockReturnValue({
      ui: { activeTab: 'fengshui' },
      setActiveTab: mockSetActiveTab
    });
    
    // 重新渲染
    rerender(<TabPanel />);
    
    // 验证内容更新
    expect(screen.getByText('环境风水布局与调理')).toBeInTheDocument();
  });
});