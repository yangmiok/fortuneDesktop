import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TabPanel } from '../TabPanel';

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

// Simple integration test without mocking the store
describe('TabPanel Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('应该渲染基本结构', () => {
    render(<TabPanel />);
    
    // 验证基本元素存在
    expect(screen.getByRole('tablist')).toBeInTheDocument();
    
    // 验证至少有一个标签页
    const tabs = screen.getAllByRole('tab');
    expect(tabs.length).toBeGreaterThan(0);
  });

  test('应该有正确的标签页数量', () => {
    render(<TabPanel />);
    
    // 验证有5个标签页
    const tabs = screen.getAllByRole('tab');
    expect(tabs).toHaveLength(5);
  });

  test('应该显示标签页标题', () => {
    render(<TabPanel />);
    
    expect(screen.getAllByText('四柱八字').length).toBeGreaterThan(0);
    expect(screen.getAllByText('紫微斗数').length).toBeGreaterThan(0);
    expect(screen.getAllByText('六爻预测').length).toBeGreaterThan(0);
    expect(screen.getAllByText('奇门遁甲').length).toBeGreaterThan(0);
    expect(screen.getAllByText('风水堪舆').length).toBeGreaterThan(0);
  });

  test('应该能够点击标签页', () => {
    render(<TabPanel />);
    
    const ziWeiTab = screen.getByText('紫微斗数');
    
    // 应该能够点击而不报错
    expect(() => {
      fireEvent.click(ziWeiTab);
    }).not.toThrow();
  });

  test('应该显示内容区域', () => {
    render(<TabPanel />);
    
    expect(screen.getByText('出生信息')).toBeInTheDocument();
    expect(screen.getByText('提交测算')).toBeInTheDocument();
  });
});
