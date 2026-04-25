# TabPanel 组件

## 概述

TabPanel 是命理测算应用的核心标签面板组件，提供五种传统命理测算方法的标签切换界面。该组件实现了标签状态持久化、响应式设计和流畅的用户交互体验。

## 功能特性

### 🎯 核心功能
- **标签切换**: 支持五种命理测算方法的无缝切换
- **状态持久化**: 自动保存和恢复用户选择的标签状态
- **响应式设计**: 适配不同屏幕尺寸的设备
- **视觉反馈**: 清晰的标签激活状态和切换动画

### 📋 支持的标签页
1. **四柱八字** (`bazi`) - 根据出生年月日时推算命理格局
2. **紫微斗数** (`ziwei`) - 紫微星系命盘分析人生运势
3. **六爻预测** (`liuyao`) - 易经六爻卦象预测吉凶
4. **奇门遁甲** (`qimen`) - 奇门遁甲时空预测分析
5. **风水堪舆** (`fengshui`) - 环境风水布局与调理

## 技术实现

### 组件架构
```typescript
interface TabPanelProps {
  className?: string;
}
```

### 状态管理
- 使用 Zustand 全局状态管理当前激活标签
- 本地状态管理标签切换的即时响应
- localStorage 持久化标签选择状态

### 样式系统
- 基于 Ant Design Tabs 组件
- 自定义 CSS 样式增强视觉效果
- 支持深色主题和响应式布局

## 使用方法

### 基本用法
```tsx
import { TabPanel } from './components';

function App() {
  return (
    <div className="app">
      <TabPanel />
    </div>
  );
}
```

### 自定义样式
```tsx
<TabPanel className="custom-tab-panel" />
```

## 状态持久化

### 本地存储
组件自动将用户选择的标签状态保存到 `localStorage`：
```typescript
localStorage.setItem('fortune_active_tab', activeTabKey);
```

### 状态恢复
应用启动时自动从本地存储恢复上次选择的标签：
```typescript
const savedTab = localStorage.getItem('fortune_active_tab');
```

### 错误处理
- 优雅处理本地存储访问错误
- 无效标签键的自动回退机制
- 控制台警告而不影响用户体验

## 响应式设计

### 桌面端 (>768px)
- 完整标签标题和图标显示
- 宽松的内边距和间距
- 完整的内容区域布局

### 平板端 (768px-480px)
- 紧凑的标签布局
- 调整后的内边距
- 优化的触摸交互区域

### 移动端 (<480px)
- 仅显示图标，隐藏文字标签
- 最小化的标签宽度
- 垂直滚动的内容区域

## 性能优化

### 渲染优化
- 使用 React.memo 避免不必要的重渲染
- 条件渲染减少 DOM 节点数量
- 懒加载标签内容

### 动画性能
- CSS 动画替代 JavaScript 动画
- GPU 加速的 transform 属性
- 合理的动画时长和缓动函数

## 可访问性

### 键盘导航
- 支持 Tab 键在标签间导航
- 支持 Enter/Space 键激活标签
- 支持方向键切换标签

### 屏幕阅读器
- 语义化的 HTML 结构
- 适当的 ARIA 属性
- 清晰的标签描述

### 视觉辅助
- 高对比度的颜色方案
- 清晰的焦点指示器
- 合适的字体大小和行高

## 测试策略

### 单元测试
- 组件渲染测试
- 状态管理测试
- 事件处理测试
- 本地存储测试

### 集成测试
- 与全局状态的集成
- 路由导航集成
- 主题切换集成

### 端到端测试
- 完整的用户交互流程
- 跨浏览器兼容性
- 性能基准测试

## 故障排除

### 常见问题

#### 标签状态不持久化
**原因**: 本地存储被禁用或清除
**解决**: 检查浏览器设置，确保允许本地存储

#### 标签切换无响应
**原因**: 状态管理器连接问题
**解决**: 检查 Zustand store 的配置和连接

#### 样式显示异常
**原因**: CSS 文件未正确加载
**解决**: 确保 CSS 文件路径正确，检查构建配置

### 调试技巧

#### 开启调试日志
```typescript
// 在组件中添加调试日志
console.log('当前标签:', currentTab);
console.log('全局状态:', activeTab);
```

#### 检查本地存储
```javascript
// 在浏览器控制台中检查
localStorage.getItem('fortune_active_tab');
```

## 未来改进

### 计划功能
- [ ] 标签页拖拽排序
- [ ] 自定义标签页配置
- [ ] 标签页内容预加载
- [ ] 更丰富的动画效果

### 性能优化
- [ ] 虚拟滚动支持
- [ ] 内容懒加载
- [ ] 缓存机制优化
- [ ] Bundle 大小优化

## 相关文档

- [设计文档](../../../.kiro/specs/fortune-telling-desktop/design.md)
- [需求文档](../../../.kiro/specs/fortune-telling-desktop/requirements.md)
- [Ant Design Tabs](https://ant.design/components/tabs/)
- [Zustand 状态管理](https://github.com/pmndrs/zustand)